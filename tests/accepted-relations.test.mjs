import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateAcceptedRelations} from '../scripts/validate-accepted-relations.mjs';
import {validateRelationProposal} from '../scripts/validate-relation-proposal.mjs';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const raw=await read('taxonomy/ai-taxonomy-l1-l2.json');
const pilot=JSON.parse(await read('proposals/relations/l0-l2-pilot.json'));
const accepted=JSON.parse(await read('taxonomy/relations/l0-l2.json'));
test('accepted data validates, proposal status cannot bypass approval',()=>{
 assert.deepEqual(validateAcceptedRelations(accepted,raw,pilot),{relations:4,sources:5});
 assert.throws(()=>validateRelationProposal(accepted,raw));
 assert.throws(()=>validateAcceptedRelations(pilot,raw,pilot));
});
test('missing approval, deferred edges and semantic drift fail',()=>{
 for(const mutate of [
 d=>delete d.relations[0].review,
 d=>d.relations[0].review.reviewer='unknown',
 d=>d.relations[0].review_status='pending',
 d=>d.relations[0].id='rel-pilot-004',
 d=>d.relations[0].scope+=' Applies universally.',
 d=>d.sources['language-pretraining'].url='https://example.org/unreviewed',
 d=>d.relations[0].target_id='ai:missing',
 d=>d.relations.push(structuredClone(d.relations[0])),
 d=>d.relations[0].evidence=[]
 ]) {const d=structuredClone(accepted);mutate(d);assert.throws(()=>validateAcceptedRelations(d,raw,pilot));}
});
test('changed taxonomy requires review',()=>assert.throws(()=>validateAcceptedRelations(accepted,raw+'\n',pilot),/Taxonomy changed/));
