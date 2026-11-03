import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {SOURCE_COMMIT,flattenTaxonomy} from '../viewer/fieldguide/core.mjs';
import {editorial,definitions,pathways,sources,terms,relations,comparisonPresets} from '../viewer/fieldguide/content.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const raw=await readFile(root+'viewer/fieldguide/data/taxonomy.json');
const data=JSON.parse(raw),nodes=flattenTaxonomy(data),ids=new Set(nodes.map(n=>n.id));
assert.equal(nodes.length,125);assert.equal(ids.size,nodes.length);assert.equal(data.level_1.length,13);
assert.equal(Object.keys(definitions).length,111);
for(const n of nodes){assert.equal(n.hierarchy_level<=2,true);if(n.hierarchy_level===2)assert.ok(editorial[n.id]?.definition,n.id);if(n.parent)assert.ok(nodes.find(p=>p.name===n.parent),n.parent);}
for(const [id,entry] of Object.entries(editorial)){assert.ok(ids.has(id),id);for(const k of entry.sources||[])assert.ok(sources[k],`${id}: missing source ${k}`);}
for(const p of pathways){assert.ok(p.steps.length>0);for(const s of p.steps)assert.ok(ids.has(s.concept),s.concept);for(const k of p.sourceIds)assert.ok(sources[k],k);}
for(const p of pathways)for(const s of p.steps)if(s.practice){
  const c=s.practice;
  for(const key of ['title','intro','takeaway'])assert.ok(typeof c[key]==='string'&&c[key].length>0,`${p.id}: ${key}`);
  assert.ok(c.columns.length>=2&&c.rows.length>0);
  for(const h of c.columns)assert.equal(typeof h,'string');
  for(const row of c.rows){assert.equal(row.length,c.columns.length);for(const cell of row)assert.equal(typeof cell,'string');}
  assert.ok(c.sourceIds.length>0);
  for(const k of c.sourceIds){assert.ok(sources[k],k);assert.ok(p.sourceIds.includes(k),`${p.id}: practice source must appear in pathway sources`);}
}
for(const r of relations){assert.ok(ids.has(r.from));assert.ok(ids.has(r.to));assert.ok(sources[r.source]);assert.ok(r.note.length>20);}
for(const t of terms){for(const id of t.concepts)assert.ok(ids.has(id));assert.ok(sources[t.source]);assert.ok(pathways.some(p=>p.id===t.path));}
for(const p of comparisonPresets){assert.equal(new Set(p.ids).size,p.ids.length);for(const id of p.ids)assert.ok(ids.has(id));}
const provenance=JSON.parse(await readFile(root+'viewer/fieldguide/data/provenance.json','utf8'));
assert.equal(provenance.upstream.commit,SOURCE_COMMIT);assert.equal(provenance.upstream.sha256,createHash('sha256').update(raw).digest('hex'));
const exported=JSON.parse(await readFile(root+'viewer/fieldguide/data/fieldguide.json','utf8'));assert.deepEqual(exported.editorial,JSON.parse(JSON.stringify(editorial)));assert.deepEqual(exported.pathways,pathways);
assert.deepEqual(exported.sources,sources);
const html=await readFile(root+'viewer/index.html','utf8');assert.ok(!/<script[^>]+src=["']https?:/i.test(html));
for(const match of html.matchAll(/(?:src|href)="\.\/([^"#?]+)"/g))await readFile(root+'viewer/'+match[1]);
for(const source of Object.values(sources))assert.equal(new URL(source.url).protocol,'https:');
console.log('PASS: 125 canonical concepts; 111 proposed definitions; all pathways, comparisons, relationships, sources, exports and local assets valid.');

assert.deepEqual(raw, await readFile(root+'taxonomy/ai-taxonomy-l1-l2.json'), 'Bundled taxonomy must match the canonical source byte-for-byte');
