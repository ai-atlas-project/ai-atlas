import {readFile, readdir, stat, mkdir, writeFile, appendFile} from 'node:fs/promises';
import {resolve, relative, sep} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {sources} from '../viewer/fieldguide/content.mjs';
import {REPO, SOURCE_COMMIT} from '../viewer/fieldguide/core.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SITE = 'https://ai-atlas-project.org';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const decode = s => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

// Static site inventory, not a JavaScript evaluator or an unrestricted crawler.
export function extractLinks(text, file) {
  // XML namespace identifiers (including inline SVG data URLs) are not links.
  text = text.replace(/\bxmlns(?::[\w-]+)?\s*=\s*(["'])(.*?)\1/g, '');
  const links = [];
  const moduleFile = /\.(m?js)$/.test(file);
  const documentFile = moduleFile ? 'viewer/index.html' : file;
  const add = (url, base = documentFile) => {
    url = decode(url.trim());
    if (!url || url.includes('${') || /^(?:data:|blob:|mailto:|tel:|javascript:)/i.test(url)) return;
    links.push({url, base, origin: file});
  };
  for (const m of text.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/g)) add(m[1]);
  for (const m of text.matchAll(/https?:\/\/[^\s<>"'`\\)]+/g)) add(m[0]);
  for (const m of text.matchAll(/\bimport\s+[^;'"\n]+?\s+from\s*["']([^"']+)["']/g)) add(m[1], file);
  for (const m of text.matchAll(/\bfetch\(\s*["']([^"']+)["']/g)) add(m[1]);
  // Classic viewer's document/data map uses quoted relative paths.
  for (const m of text.matchAll(/["'](\.\.?\/[^"'\s]+\.(?:json|md|html|svg|png|jpg|css)(?:[?#][^"']*)?)["']/g)) add(m[1]);
  for (const m of text.matchAll(/url\(\s*["']?([^\s)"']+)["']?\s*\)/g)) add(m[1], file);
  for (const m of text.matchAll(/REPO\s*\+\s*['"]([^'"]+)['"]/g)) {
    // The one commit-dependent URL is registered explicitly below.
    if (!m[1].endsWith('/blob/')) add(REPO + m[1]);
  }
  return links;
}

export function extractMarkdownLinks(text, file) {
  const links = [];
  // Inline links/images and reference definitions; ignore fenced code examples.
  text = text.replace(/```[\s\S]*?```/g, '');
  for (const pattern of [/!?\[[^\]]*\]\(<?([^\s)>]+)>?(?:\s+["'][^"']*["'])?\)/g, /^\s*\[[^\]]+\]:\s*<?([^\s>]+)>?/gm]) {
    for (const match of text.matchAll(pattern)) links.push({url: decode(match[1]), base: file, origin: file + ' (rendered document)'});
  }
  return links;
}

export async function collectLinks(root = ROOT) {
  const files = ['index.html'];
  async function walk(dir) {
    for (const entry of await readdir(resolve(root, dir), {withFileTypes: true})) {
      const path = dir + '/' + entry.name;
      if (entry.isDirectory()) await walk(path);
      else if (/\.(html|m?js|css)$/.test(path)) files.push(path);
    }
  }
  await walk('viewer');
  const links = [];
  for (const file of files) links.push(...extractLinks(await readFile(resolve(root, file), 'utf8'), file));
  const documents = new Set(links.filter(l => /\.md(?:[?#]|$)/.test(l.url) && !/^https?:/.test(l.url)).map(l => new URL(l.url, SITE + '/' + l.base).pathname));
  for (const document of documents) {
    const file = decodeURIComponent(document.slice(1));
    try {links.push(...extractMarkdownLinks(await readFile(resolve(root, file), 'utf8'), file));}
    catch (error) {if (error.code !== 'ENOENT') throw error;} // Missing files are reported by checkLocal.
  }
  for (const [key, source] of Object.entries(sources)) links.push({url: source.url, base: 'viewer/index.html', origin: `source:${key}`});
  links.push({url: `${REPO}/blob/${SOURCE_COMMIT}/taxonomy/ai-taxonomy-l1-l2.json`, base: 'viewer/index.html', origin: 'canonical provenance'});
  const inventory = new Map();
  for (const link of links) {
    let url;
    try {url = new URL(link.url, SITE + '/' + link.base);} catch {throw new Error(`Invalid URL in ${link.origin}: ${link.url}`);}
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error(`Unsupported URL in ${link.origin}`);
    const local = url.origin === SITE;
    // Hash routes and document anchors are not separate HTTP resources.
    url.hash = '';
    if (!url.search) url.search = ''; // Deduplicate a generated empty query string.
    const key = (local ? 'local:' : 'external:') + url.href;
    if (!inventory.has(key)) inventory.set(key, {url: url.href, local, origins: []});
    const item = inventory.get(key);
    if (!item.origins.includes(link.origin)) item.origins.push(link.origin);
  }
  return [...inventory.values()].sort((a, b) => a.url.localeCompare(b.url));
}

export async function checkLocal(url, root = ROOT) {
  const pathname = decodeURIComponent(new URL(url).pathname);
  let target = resolve(root, '.' + pathname);
  if (relative(root, target).split(sep).includes('..')) return {state: 'broken', detail: 'Path escapes site root'};
  try {
    if ((await stat(target)).isDirectory()) target = resolve(target, 'index.html');
    if (!(await stat(target)).isFile()) throw new Error('Not a file');
    return {state: 'ok', detail: relative(root, target)};
  } catch {return {state: 'broken', detail: 'Missing local file: ' + relative(root, target)};}
}

export function classifyHTTP(status, finalUrl, requestedUrl) {
  if (status >= 200 && status < 300) {
    if (/\/(?:login|signin|sign-in|auth)(?:[/?#]|$)/i.test(new URL(finalUrl).pathname)) return 'manual';
    return finalUrl !== requestedUrl ? 'redirected' : 'ok';
  }
  if ([404, 410].includes(status)) return 'broken';
  if ([401, 403, 407, 429, 451, 999].includes(status)) return 'manual';
  return 'unreachable';
}

export async function checkExternal(url, {fetchImpl = fetch, pause = sleep, timeoutMs = 15000} = {}) {
  const attempts = [];
  // Retry missing pages and temporary/network failures once; never hammer blocked hosts.
  for (let i = 0; i < 2; i++) {
    let result;
    try {
      const response = await fetchImpl(url, {method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(timeoutMs), headers: {'User-Agent': 'AI-Atlas-Link-Check (+https://github.com/ai-atlas-project/ai-atlas)', Accept: '*/*'}});
      const finalUrl = response.url || url;
      const state = classifyHTTP(response.status, finalUrl, url);
      result = {state, status: response.status, finalUrl, detail: `HTTP ${response.status}`};
      // Reachability only: do not download papers, archives, or entire page bodies.
      await response.body?.cancel();
    } catch (error) {result = {state: 'unreachable', detail: String(error.cause?.code || error.name || 'Network error')};}
    attempts.push(result);
    if (!['broken', 'unreachable'].includes(result.state) || i === 1) {
      // A single 404 after a network failure is uncertain, not a confirmed missing page.
      if (result.state === 'broken' && !attempts.every(a => a.state === 'broken')) result = {...result, state: 'unreachable', detail: 'Inconsistent responses; inspect attempts'};
      return {...result, attempts};
    }
    await pause(1500);
  }
}

const md = value => String(value).replace(/[\r\n]+/g, ' ').replace(/\|/g, '\\|').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export function renderReport(report) {
  const counts = Object.fromEntries(['ok','redirected','broken','manual','unreachable'].map(s => [s, report.results.filter(r => r.state === s).length]));
  const rows = report.results.filter(r => r.state !== 'ok');
  return `# Website link health\n\nChecked: ${report.checkedAt}\n\nScope: ${report.scope}\n\n${report.results.length} targets: ${Object.entries(counts).map(([s,n])=>`${n} ${s}`).join(', ')}.\n\n` +
    (rows.length ? `| Status | URL | Result / final URL | Used in |\n| --- | --- | --- | --- |\n${rows.map(r => `| ${md(r.state)} | ${md(r.url)} | ${md(r.detail)}${r.finalUrl && r.finalUrl !== r.url ? ' → '+md(r.finalUrl) : ''} | ${r.origins.map(md).join(', ')} |`).join('\n')}\n` : 'No problems detected within the checked scope.\n') +
    '\nBroken = missing local file or repeated HTTP 404/410. Unreachable = network/server/other unresolved failure. Manual = access restriction, rate limit, or sign-in redirect; this is not proof the page is missing. Redirected = successful response at another URL; review destination relevance.\n\nHTTP success does not prove content relevance or detect every soft-404. External fragments, JavaScript-only links, and hash-route behavior need separate review/tests. No links are automatically removed or replaced.\n';
}

export async function run({root = ROOT, localOnly = false, output = '.cache/link-health'} = {}) {
  const inventory = await collectLinks(root);
  const results = [];
  const local = inventory.filter(l => l.local);
  for (const link of local) results.push({...link, ...await checkLocal(link.url, root)});
  if (!localOnly) {
    const byHost = new Map();
    for (const link of inventory.filter(l => !l.local)) {
      const host = new URL(link.url).host;
      if (!byHost.has(host)) byHost.set(host, []);
      byHost.get(host).push(link);
    }
    const groups = [...byHost.values()];
    async function worker() {
      while (groups.length) {
        const group = groups.shift();
        for (const link of group) {
          const result = {...link, ...await checkExternal(link.url)};
          results.push(result);
          console.log(`${result.state}: ${link.url} (${result.detail})`);
          await sleep(250);
        }
      }
    }
    await Promise.all(Array.from({length: Math.min(3, groups.length)}, worker));
  }
  results.sort((a,b) => a.url.localeCompare(b.url));
  const report = {checkedAt: new Date().toISOString(), scope: localOnly ? 'Local files referenced by the website' : 'Website static links/assets, displayed Markdown documents, Fieldguide sources, and repository/provenance URLs', results};
  const directory = resolve(root, output);
  await mkdir(directory, {recursive: true});
  const markdown = renderReport(report);
  await writeFile(resolve(directory, 'report.json'), JSON.stringify(report, null, 2)+'\n');
  await writeFile(resolve(directory, 'report.md'), markdown);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown);
  const failures = results.filter(r => ['broken','unreachable'].includes(r.state));
  for (const r of results.filter(r => r.state === 'manual')) console.log('Manual review required: '+r.url);
  console.log(`Checked ${results.length} targets; ${failures.length} failures. Report: ${directory}/report.md`);
  return failures.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.some(a => a !== '--local-only')) throw new Error('Usage: node scripts/check-site-links.mjs [--local-only]');
  process.exitCode = await run({localOnly: args.includes('--local-only')});
}
