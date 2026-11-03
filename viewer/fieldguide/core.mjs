export const SOURCE_COMMIT = '64dac8d78f1587494ba0b56b489fd8e650601860';
export const REPO = 'https://github.com/ai-atlas-project/ai-atlas';
export const SNAPSHOT_DATE = '2026-10-29';
export const STORE_KEY = 'ai-atlas-fieldguide-v1';
export function flattenTaxonomy(data) {
  return [data.level_0, ...data.level_1.flatMap(b => [b,...b.level_2])].map(n => ({...n, level_2: undefined}));
}
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const normalise = s => String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export function searchConcepts(nodes, query, additions = {}, filters = {}) {
  const q=normalise(query), words=q.split(' ').filter(Boolean);
  return nodes.filter(n => (!filters.branch || n.id===filters.branch || n.parent===nodes.find(x=>x.id===filters.branch)?.name) && (!filters.type || n.concept_type===filters.type) && (!filters.stability || n.stability===filters.stability))
    .map(n=>{
      const extra=additions[n.id]||{};
      const name=normalise(n.name), aliases=(extra.aliases||[]).map(normalise);
      const haystack=normalise([n.name,n.id,n.parent,n.concept_type,n.description,extra.definition,...(extra.aliases||[])].filter(Boolean).join(' '));
      const match=!q || words.every(w=>haystack.includes(w));
      const score=name===q?100:aliases.includes(q)?90:name.startsWith(q)?70:name.includes(q)?50:10;
      return {node:n,match,score};
    }).filter(x=>x.match).sort((a,b)=>q?b.score-a.score:0).map(x=>x.node);
}
export function readRoute(hash) {
  const input=hash.replace(/^#\/?/,'');
  const [page='home',query='']=input.split('?');
  return {page:page||'home',params:new URLSearchParams(query)};
}
export function conceptURL(id) {return '#/explore?concept='+encodeURIComponent(id);}
export function safeNotebook(raw, validIds, validSteps = null) {
  const fallback={saved:[],notes:{},checks:[],brief:''};
  if(!raw || typeof raw!=='object' || Array.isArray(raw))return fallback;
  const allowed=new Set(validIds);
  const saved=[...new Set(Array.isArray(raw.saved)?raw.saved:[])].filter(x=>allowed.has(x));
  const notes={};
  for(const [id,value] of Object.entries(raw.notes&&typeof raw.notes==='object'?raw.notes:{}))if(allowed.has(id)&&typeof value==='string')notes[id]=value.slice(0,20000);
  const checks=[...new Set(Array.isArray(raw.checks)?raw.checks:[])].filter(x=>typeof x==='string' && (!validSteps || validSteps.includes(x)));
  return {saved,notes,checks,brief:typeof raw.brief==='string'?raw.brief.slice(0,30000):''};
}
export function exportNotebook(notebook,nodes,origin,pathways=[]) {
  const index=new Map(nodes.map(n=>[n.id,n]));
  const sections=notebook.saved.filter(id=>index.has(id)).map(id=>{
    const n=index.get(id);
    return `## ${n.name}\n\n- Concept ID: ${id}\n- Type: ${n.concept_type}\n- Canonical level: ${n.hierarchy_level}\n- Atlas: ${new URL(conceptURL(id),origin).href}\n\n${notebook.notes[id]||'No notes yet.'}`;
  });
  const progress=pathways.map(p=>`### ${p.title}\n\n`+p.steps.map((s,i)=>`- [${notebook.checks.includes(p.id+':'+i)?'x':' '}] ${s.title}`).join('\n')).join('\n\n');
  return `# AI Atlas field notebook\n\n${notebook.brief||'My learning and project notes.'}\n\n${sections.join('\n\n')}\n\n## Pathway progress\n\n${progress}\n\n---\nTaxonomy: AI Atlas v0.1, snapshot ${SNAPSHOT_DATE}, commit ${SOURCE_COMMIT}.\nAI Atlas by Alyaksandr Stzhalkouski. Canonical content: CC BY-SA 4.0.\nEditorial pathways are proposals, not canonical taxonomy.\n`;
}

export function exportPathwayChecklist(pathway,nodes,sources,checks=[]) {
  const names=new Map(nodes.map(n=>[n.id,n.name]));
  const cell=value=>String(value).replace(/\|/g,'\\|').replace(/\r?\n/g,' ');
  const steps=pathway.steps.map((step,i)=>{
    const practice=step.practice;
    const example=practice?`\n\n### ${practice.title}\n\n${practice.intro}\n\n| ${practice.columns.map(cell).join(' | ')} |\n| ${practice.columns.map(()=>'---').join(' | ')} |\n${practice.rows.map(row=>'| '+row.map(cell).join(' | ')+' |').join('\n')}\n\n${practice.takeaway}\n\nSupporting sources:\n${practice.sourceIds.map(k=>`- ${sources[k].title}: ${sources[k].url}`).join('\n')}`:'';
    return `## ${i+1}. ${step.title}\n\n${step.text}\n\nConcept: ${names.get(step.concept)||step.concept} (${step.concept})${example}\n\n- [${checks.includes(pathway.id+':'+i)?'x':' '}] ${step.task}`;
  }).join('\n\n');
  return `# ${pathway.title}\n\n${pathway.description}\n\nOutcome: ${pathway.outcome}\n\n${steps}\n\nPrimary sources:\n${pathway.sourceIds.map(k=>`- ${sources[k].title}: ${sources[k].url}`).join('\n')}\n\nProposed editorial pathway, not canonical taxonomy.\nTaxonomy snapshot ${SNAPSHOT_DATE}, commit ${SOURCE_COMMIT}.\nAI Atlas by Alyaksandr Stzhalkouski · CC BY-SA 4.0.\n`;
}
