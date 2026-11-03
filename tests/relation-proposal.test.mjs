import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateRelationProposal} from '../scripts/validate-relation-proposal.mjs';
const raw=await readFile(new URL('../taxonomy/ai-taxonomy-l1-l2.json',import.meta.url),'utf8');
const pilot=JSON.parse(await readFile(new URL('../proposals/relations/l0-l2-pilot.json',import.meta.url),'utf8'));
const altered=mutate=>{const d=structuredClone(pilot); mutate(d); return d;};

test('proposal resolves five scoped relations with evidence without promoting them',()=>{
  assert.deepEqual(validateRelationProposal(pilot,raw),{relations:5,sources:5});
});
test('canonical promotion and unreviewed approval are rejected',()=>{
  for(const mutate of [d=>d.canonical=true,d=>d.status='approved',d=>d.relations[0].review_status='approved']) assert.throws(()=>validateRelationProposal(altered(mutate),raw));
});
test('unresolved IDs, name mismatch, private targets, unknown fields and relation types fail',()=>{
  for(const mutate of [d=>d.relations[0].target_id='ai:nonexistent',d=>d.relations[0].target_name='Wrong name',d=>d.relations[0].target_status='private_draft',d=>d.relations[0].confidence=1,d=>d.relations[0].type='overlaps_with']) assert.throws(()=>validateRelationProposal(altered(mutate),raw));
});
test('self-links and primary hierarchy duplicates fail',()=>{
  for(const [id,name] of [['ai:large-language-models','Large Language Models'],['ai:foundation-models-and-general-purpose-ai','Foundation Models and General-Purpose AI']]){
    const data=altered(d=>{d.relations[0].target_id=id;d.relations[0].target_name=name;});
    assert.throws(()=>validateRelationProposal(data,raw),/Self-link|primary hierarchy/);
  }
});
test('repeated edges and reversed symmetric duplicates fail even with different IDs',()=>{
  for(const reverse of [false,true]){
    const data=structuredClone(pilot), r=structuredClone(data.relations.find(r=>r.type==='related-to'));
    r.id='rel-duplicate';
    if(reverse){[r.source_id,r.target_id]=[r.target_id,r.source_id];[r.source_name,r.target_name]=[r.target_name,r.source_name];}
    data.relations.push(r);assert.throws(()=>validateRelationProposal(data,raw),/Duplicate relation/);
  }
});
test('missing evidence, insecure URLs, and empty scope are rejected',()=>{
  for(const mutate of [d=>d.relations[0].evidence=[],d=>d.relations[0].evidence[0].source_id='missing',d=>d.sources['language-pretraining'].url='http://example.org',d=>d.relations[0].scope='']) assert.throws(()=>validateRelationProposal(altered(mutate),raw));
});
test('a changed taxonomy requires a fresh review of the proposal snapshot',()=>{
  assert.throws(()=>validateRelationProposal(pilot,raw+'\n'),/Taxonomy changed/);
});
