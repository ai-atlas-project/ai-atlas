import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {extractLinks, extractMarkdownLinks, checkLocal, checkExternal, classifyHTTP, collectLinks, renderReport} from '../scripts/check-site-links.mjs';
import {sources} from '../viewer/fieldguide/content.mjs';

const response = (status, url='https://example.org/paper') => ({status, url, body: {cancel: async()=>{}}});
const options = statuses => {
  let calls=0;
  return {fetchImpl: async()=>{const status=statuses[calls++];assert.ok(status, 'unexpected extra request');if(status==='network')throw new Error('Network');return response(status);},pause:async()=>{}};
};

test('missing pages require confirmation and transient outages can recover', async()=>{
  const missing=await checkExternal('https://example.org/paper', options([404,410]));
  assert.equal(missing.state,'broken');assert.equal(missing.attempts.length,2);
  assert.equal((await checkExternal('https://example.org/paper',options([503,200]))).state,'ok');
  assert.equal((await checkExternal('https://example.org/paper',options(['network',404]))).state,'unreachable');
  assert.equal((await checkExternal('https://example.org/paper',options(['network','network']))).state,'unreachable');
});
test('access restrictions and rate limits are not classified as dead links or retried', async()=>{
  for (const code of [401,403,429,451,999]) {
    const r=await checkExternal('https://example.org/paper',options([code]));
    assert.equal(r.state,'manual');assert.equal(r.attempts.length,1);
  }
  assert.equal(classifyHTTP(200,'https://example.org/login','https://example.org/paper'),'manual');
  assert.equal(classifyHTTP(200,'https://example.org/new-paper','https://example.org/paper'),'redirected');
});
test('module imports resolve separately from document-relative downloads and fetches',()=>{
  const links=extractLinks(`import x from './core.mjs'; fetch('./fieldguide/data/taxonomy.json'); <a href="./classic.html">x</a><a href="https://example.org/?a=1&amp;b=2">y</a><a href="\${dynamic}">z</a>`, 'viewer/fieldguide/app.mjs');
  assert.ok(links.some(l=>l.url==='./core.mjs'&&l.base==='viewer/fieldguide/app.mjs'));
  assert.ok(links.some(l=>l.url==='./fieldguide/data/taxonomy.json'&&l.base==='viewer/index.html'));
  assert.ok(links.some(l=>l.url==='https://example.org/?a=1&b=2'));
  assert.ok(!links.some(l=>l.url.includes('${')));
  assert.deepEqual(extractLinks("note:'Different from',title:'Example'", 'viewer/fieldguide/content.mjs'),[]);
  assert.deepEqual(extractLinks("mask:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E\")",'viewer/icons.css'),[]);
});
test('local URLs ignore query parameters and hashes but require a real file/index',async()=>{
  const root=await mkdtemp(join(tmpdir(),'atlas-links-'));
  try {
    await mkdir(join(root,'viewer'));await writeFile(join(root,'viewer/index.html'),'ok');
    assert.equal((await checkLocal('https://ai-atlas-project.org/viewer/?doc=review#/x',root)).state,'ok');
    assert.equal((await checkLocal('https://ai-atlas-project.org/missing.html',root)).state,'broken');
  } finally {await rm(root,{recursive:true,force:true});}
});
test('inventory includes every registered source and composed project URLs without placeholders',async()=>{
  const links=await collectLinks();
  for(const source of Object.values(sources))assert.ok(links.some(l=>l.url===new URL(source.url).href.split('#')[0]),source.url);
  assert.ok(links.some(l=>l.url.endsWith('/blob/main/LICENSES.md')));
  assert.ok(links.some(l=>l.url.includes('/blob/64dac8d78f1587494ba0b56b489fd8e650601860/')));
  assert.ok(!links.some(l=>l.url.includes('${')));
});
test('report exposes unresolved checks, redirect destinations, and origins',()=>{
  const output=renderReport({checkedAt:'test',scope:'test',results:[{state:'manual',url:'https://example.org/x',detail:'HTTP 403',origins:['source:test']},{state:'redirected',url:'https://example.org/old',finalUrl:'https://example.org/new',detail:'HTTP 200',origins:['viewer/index.html']}]});
  assert.ok(output.includes('1 manual'));assert.ok(output.includes('https://example.org/new'));assert.ok(output.includes('source:test'));
});

test('rendered Markdown downloads resolve relative to the source document',async()=>{
  const links=extractMarkdownLinks('[PDF](assets/report.pdf)\n[reference]: https://example.org/paper', 'docs/releases/release.md');
  assert.equal(links[0].base,'docs/releases/release.md');
  assert.equal(links[0].url,'assets/report.pdf');
  assert.equal(links[1].url,'https://example.org/paper');
  const inventory=await collectLinks();
  assert.ok(inventory.some(l=>l.url==='https://ai-atlas-project.org/docs/releases/assets/ai-atlas-v0.1-public-preview.pdf'));
  assert.ok(!inventory.some(l=>l.url==='https://ai-atlas-project.org/viewer/assets/ai-atlas-v0.1-public-preview.pdf'));
});
