import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdtemp, rm, mkdir, access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {renderViews,syncViews} from '../scripts/generate-taxonomy-views.mjs';

const raw = await readFile(new URL('../taxonomy/ai-taxonomy-l1-l2.json',import.meta.url),'utf8');
const taxonomy = JSON.parse(raw);
const clone = () => structuredClone(taxonomy);
const vault = 'obsidian/AI Atlas Vault';
async function sandbox(t) {
  const dir = await mkdtemp(path.join(tmpdir(),'atlas-views-'));
  t.after(() => rm(dir,{recursive:true,force:true}));
  return dir;
}

test('all L0–L2 concepts appear exactly once with canonical metadata and hierarchy', () => {
  const views = renderViews(raw);
  assert.equal(views.size,129);
  assert.equal(views.get('viewer/fieldguide/data/taxonomy.json'),raw);
  const markdown = views.get('taxonomy/ai-taxonomy-l1-l2.md');
  assert.deepEqual([...markdown.matchAll(/^### \d+\. (.+)$/gm)].map(m=>m[1]),taxonomy.level_1.map(b=>b.name));
  const markmap = views.get('markmap/ai-atlas-markmap.md');
  assert.deepEqual([...markmap.matchAll(/^### (.+)$/gm)].map(m=>m[1]),taxonomy.level_1.flatMap(b=>b.level_2.map(n=>n.name)));
  const graph = views.get('mermaid/ai-atlas-mermaid.md');
  assert.equal((graph.match(/ --> /g)||[]).length,124);
  for (const b of taxonomy.level_1) for (const n of [b,...b.level_2]) {
    const note = views.get(`${vault}/Level ${n.hierarchy_level}/${n.name}.md`);
    assert.ok(note.includes(`id: "${n.id}"`));
    assert.ok(note.includes(`concept_type: "${n.concept_type}"`));
    assert.ok(note.includes(n.description));
    assert.equal([...views.values()].filter(text=>text.includes(`id: "${n.id}"`)).length,1);
  }
});

test('canonical array order drives views, independent of children metadata order', () => {
  const changed=clone(); changed.level_1.reverse(); changed.level_1[0].level_2.reverse();
  const views=renderViews(JSON.stringify(changed));
  const md=views.get('taxonomy/ai-taxonomy-l1-l2.md');
  assert.ok(md.indexOf('### 1. AGI and Future AI') < md.indexOf('### 13. Symbolic AI'));
  assert.ok(md.indexOf('- Long-Term AI Futures') < md.indexOf('- Artificial General Intelligence'));
});

test('check detects stale, missing, and extra pages without writing; regeneration is idempotent', async t => {
  const dir=await sandbox(t), views=renderViews(raw);
  await syncViews(dir,views,true);
  assert.deepEqual(await syncViews(dir,views),[]);
  const stale='markmap/ai-atlas-markmap.md', missing=`${vault}/Level 2/Deep Learning.md`, extra=`${vault}/Level 2/Old Name.md`;
  await writeFile(path.join(dir,stale),'stale');
  await rm(path.join(dir,missing));
  await writeFile(path.join(dir,extra),views.get(missing));
  const changes=await syncViews(dir,views);
  assert.ok(changes.includes(`Stale: ${stale}`)); assert.ok(changes.includes(`Missing: ${missing}`)); assert.ok(changes.includes(`Obsolete: ${extra}`));
  assert.equal(await readFile(path.join(dir,stale),'utf8'),'stale');
  await assert.rejects(access(path.join(dir,missing)));
  await syncViews(dir,views,true);
  await assert.rejects(access(path.join(dir,extra)));
  assert.deepEqual(await syncViews(dir,views,true),[]);
});

test('rename removes the old generated note, retains ID, and updates parent links', async t => {
  const dir=await sandbox(t); await syncViews(dir,renderViews(raw),true);
  const changed=clone(), branch=changed.level_1[1], leaf=branch.level_2.find(n=>n.name==='Deep Learning');
  leaf.name='Deep Learning Renamed'; branch.children=branch.children.map(n=>n==='Deep Learning'?leaf.name:n);
  const views=renderViews(JSON.stringify(changed)); await syncViews(dir,views,true);
  await assert.rejects(access(path.join(dir,`${vault}/Level 2/Deep Learning.md`)));
  assert.match(await readFile(path.join(dir,`${vault}/Level 2/${leaf.name}.md`),'utf8'),/id: "ai:deep-learning"/);
  assert.ok(views.get(`${vault}/Level 1/Machine Learning.md`).includes('[[Level 2/Deep Learning Renamed|Deep Learning Renamed]]'));
});

test('unknown notes block cleanup before writes; unrelated vault notes are preserved', async t => {
  const dir=await sandbox(t), views=renderViews(raw);
  await mkdir(path.join(dir,`${vault}/Level 2`),{recursive:true});
  await writeFile(path.join(dir,`${vault}/Level 2/Personal.md`),'my notes');
  await writeFile(path.join(dir,`${vault}/Boundary Notes.md`),'manual content');
  await assert.rejects(syncViews(dir,views,true),/Refusing to remove/);
  await assert.rejects(access(path.join(dir,'taxonomy/ai-taxonomy-l1-l2.md')));
  assert.equal(await readFile(path.join(dir,`${vault}/Boundary Notes.md`),'utf8'),'manual content');
});

test('rejects unsafe names, duplicate IDs, missing parents, and unsupported depth', () => {
  for (const mutate of [d=>d.level_1[0].name='../outside',d=>d.level_1[0].id=d.level_0.id,d=>d.level_1[0].level_2[0].parent='missing',d=>d.level_1[0].level_2[0].hierarchy_level=3]) {
    const data=clone(); mutate(data); assert.throws(()=>renderViews(JSON.stringify(data)));
  }
});
