#!/usr/bin/env node
// Validates a review proposal, never approves or promotes relation assertions.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';

export const relationTypes = Object.freeze({uses:'directed','applies-to':'directed','related-to':'symmetric'});
const nonempty = (value,label) => assert.ok(typeof value === 'string' && value.trim().length > 0,`${label} must be nonempty text`);
function fields(value,keys,label) {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value),`${label} must be an object`);
  assert.deepEqual(Object.keys(value).sort(),[...keys].sort(),`${label}: unexpected or missing fields`);
}

export function validateRelationProposal(data,taxonomyRaw) {
  fields(data,['schema_version','status','canonical','taxonomy','sources','relations'],'proposal');
  assert.equal(data.schema_version,1,'Unsupported proposal schema');
  assert.equal(data.status,'proposed','Proposal must remain proposed');
  assert.equal(data.canonical,false,'Proposal must remain non-canonical');
  fields(data.taxonomy,['path','sha256'],'taxonomy reference');
  assert.equal(data.taxonomy.path,'taxonomy/ai-taxonomy-l1-l2.json');
  assert.equal(data.taxonomy.sha256,createHash('sha256').update(taxonomyRaw).digest('hex'),'Taxonomy changed: re-review proposal references and scope before refreshing its hash');
  const taxonomy=JSON.parse(taxonomyRaw);
  const nodes=[taxonomy.level_0,...taxonomy.level_1.flatMap(b=>[b,...b.level_2])];
  const byId=new Map(nodes.map(n=>[n.id,n]));
  assert.equal(byId.size,nodes.length,'Canonical IDs must be unique');
  assert.ok(data.sources && typeof data.sources === 'object' && !Array.isArray(data.sources),'sources must be an object');
  for (const [id,s] of Object.entries(data.sources)) {
    assert.match(id,/^[a-z][a-z0-9-]*$/,'Invalid evidence ID');
    fields(s,['title','authors','url'],`source ${id}`);
    nonempty(s.title,'source title'); nonempty(s.authors,'source authors');
    const url=new URL(s.url);
    assert.ok(url.protocol === 'https:' && !url.username && !url.password,'Evidence must use a public HTTPS URL');
  }
  assert.ok(Array.isArray(data.relations) && data.relations.length > 0 && data.relations.length <= 10,'Pilot requires 1–10 relations');
  const ids=new Set(), edges=new Set(), usedSources=new Set();
  for (const r of data.relations) {
    fields(r,['id','type','source_id','source_name','target_id','target_name','target_status','scope','rationale','evidence','review_status'], 'relation');
    assert.match(r.id,/^rel-[a-z0-9]+(?:-[a-z0-9]+)*$/,'Invalid relation ID');
    assert.ok(!ids.has(r.id),`Duplicate relation ID: ${r.id}`); ids.add(r.id);
    assert.ok(Object.hasOwn(relationTypes,r.type),`Unsupported relation type: ${r.type}`);
    assert.equal(r.review_status,'pending','Human review must remain pending in this proposal format');
    assert.equal(r.target_status,'canonical','Only existing canonical targets are supported');
    for (const side of ['source','target']) {
      const n=byId.get(r[`${side}_id`]);
      assert.ok(n,`Unknown canonical ${side}: ${r[`${side}_id`]}`);
      assert.equal(r[`${side}_name`],n.name,`${side} name does not match stable ID`);
      assert.ok([0,1,2].includes(n.hierarchy_level),'No Level 3 promotion');
    }
    assert.notEqual(r.source_id,r.target_id,'Self-link is not allowed');
    const source=byId.get(r.source_id), target=byId.get(r.target_id);
    assert.ok(source.parent !== target.name && target.parent !== source.name,'Pilot must not duplicate a primary hierarchy edge');
    const pair=relationTypes[r.type] === 'symmetric' ? [r.source_id,r.target_id].sort() : [r.source_id,r.target_id];
    const edge=JSON.stringify([r.type,...pair]);
    assert.ok(!edges.has(edge),'Duplicate relation (including reverse symmetric link)'); edges.add(edge);
    for (const k of ['scope','rationale']) { nonempty(r[k],k); assert.ok(r[k].trim().length >= 40,`${k} must explain the assertion and its limits`); }
    assert.ok(Array.isArray(r.evidence) && r.evidence.length > 0,'Relation requires evidence');
    const evidenceKeys=new Set();
    for (const e of r.evidence) {
      fields(e,['source_id','locator','support'],'evidence');
      assert.ok(Object.hasOwn(data.sources,e.source_id),`Missing evidence source: ${e.source_id}`);
      nonempty(e.locator,'evidence locator'); nonempty(e.support,'evidence support');
      assert.ok(e.support.trim().length >= 40,'Evidence support must explain how the source supports this scoped claim');
      const key=JSON.stringify([e.source_id,e.locator]); assert.ok(!evidenceKeys.has(key),'Duplicate evidence'); evidenceKeys.add(key);
      usedSources.add(e.source_id);
    }
  }
  assert.equal(usedSources.size,Object.keys(data.sources).length,'Unused evidence sources must be removed');
  return {relations:data.relations.length,sources:usedSources.size};
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const root=fileURLToPath(new URL('../',import.meta.url));
  try {
    const data=JSON.parse(await readFile(path.join(root,'proposals/relations/l0-l2-pilot.json'),'utf8'));
    const result=validateRelationProposal(data,await readFile(path.join(root,'taxonomy/ai-taxonomy-l1-l2.json'),'utf8'));
    console.log(`PASS: ${result.relations} proposed relations, ${result.sources} evidence sources; all remain pending human review, not canonical.`);
  } catch (e) { console.error(e.message); process.exitCode=1; }
}
