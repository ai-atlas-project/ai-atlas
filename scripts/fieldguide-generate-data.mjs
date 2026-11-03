import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {SOURCE_COMMIT,REPO,SNAPSHOT_DATE} from '../viewer/fieldguide/core.mjs';
import {editorial,pathways,terms,sources,comparisonPresets,relations} from '../viewer/fieldguide/content.mjs';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const canonical=await readFile(root+'viewer/fieldguide/data/taxonomy.json');
const provenance={
  project:'AI Atlas Fieldguide',kind:'Public fieldguide with proposed editorial guidance',retrievedOn:SNAPSHOT_DATE,
  upstream:{repository:REPO,commit:SOURCE_COMMIT,file:'taxonomy/ai-taxonomy-l1-l2.json',sha256:createHash('sha256').update(canonical).digest('hex'),version:'0.1',canonicalLevels:[0,1,2]},
  layers:{canonical:'Unmodified upstream file, including all names, IDs, parents, types, stability labels and original descriptions.',editorial:'Proposed explanations, contextual search terms, pathways, comparisons and relationships. Not community-reviewed or canonical.',personal:'Browser-local notes, saved concept IDs and self-reported checklists. Not part of the taxonomy.'},
  attribution:'AI Atlas by Alyaksandr Stzhalkouski',contentLicense:'CC BY-SA 4.0',codeLicense:'MIT',brandNote:'AI Atlas brand and official paid designs are not automatically licensed for commercial reuse.',
  limitations:['Static snapshot, not live synchronization','No Level 3 promotion','Editorial guidance requires review','No model training or inference','No cloud synchronization of notes','No user interviews or usage analytics were used to validate design hypotheses']
};
await writeFile(root+'viewer/fieldguide/data/provenance.json',JSON.stringify(provenance,null,2)+'\n');
await writeFile(root+'viewer/fieldguide/data/fieldguide.json',JSON.stringify({status:'proposed-editorial',canonical:false,sourceCommit:SOURCE_COMMIT,editorial,pathways,terms,sources,comparisons:comparisonPresets,relations},null,2)+'\n');
console.log('Generated editorial export and provenance. Canonical data was not rewritten.');
