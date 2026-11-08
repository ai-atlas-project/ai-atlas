import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {validateRelationProposal} from './validate-relation-proposal.mjs';
const review={"reviewer":"Elvistudio (project maintainer)","reviewed_at":"2026-11-08","decision_url":"https://github.com/ai-atlas-project/ai-atlas/blob/codex/promote-four-relations/taxonomy/relations/decision-2026-11-08.md","reviewed_commit":"a052ba625698dedbca908bc93203cf0d6327c520","rationale":"Maintainer explicitly approved the four scoped assertions and decisions A–E in the project conversation."};
export function validateAcceptedRelations(data,raw,pilot) {
 assert.equal(data.status,'accepted'); assert.equal(data.canonical,true);
 assert.deepEqual(data.relations.map(r=>r.id),['rel-pilot-001','rel-pilot-002','rel-pilot-003','rel-pilot-005'],'Unreviewed relation set');
 const copy=structuredClone(data); copy.status='proposed'; copy.canonical=false;
 for(const r of copy.relations) {
  assert.equal(r.review_status,'accepted');
  assert.ok(['uses','applies-to'].includes(r.type));
  assert.deepEqual(r.review,review,'Missing or changed decision provenance');
  delete r.review; r.review_status='pending';
 }
 const result=validateRelationProposal(copy,raw);
 assert.deepEqual(copy,pilot,'Semantic changes require renewed review');
 return result;
}
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
 try {
  const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
  const result=validateAcceptedRelations(JSON.parse(await read('taxonomy/relations/l0-l2.json')),await read('taxonomy/ai-taxonomy-l1-l2.json'),JSON.parse(await read('proposals/relations/l0-l2-pilot.json')));
  console.log('PASS: '+result.relations+' accepted relations.');
 } catch(e) {console.error(e.message);process.exitCode=1;}
}
