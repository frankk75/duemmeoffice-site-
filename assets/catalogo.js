/* DUEMME V81: crea le schede soltanto all’apertura delle fisarmoniche. */
/* DUEMME V72 – Catalogo per marche Olivetti, Ricoh, Canon; categorie apribili e JSON compatibile Pages CMS. */
(()=>{'use strict';
const assetUrl = value => {
  if(typeof value!=='string'||!value.trim())return '';
  try {const u=new URL(value,document.baseURI);return ['http:','https:'].includes(u.protocol)?u.href:''}catch(_){return ''}
};
const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el};
function photo(p,large=false){
  const wrap=node('span','du-model-photo'+(large?' du-model-photo--large':''));
  const url=assetUrl(p.image);
  if(url){const img=node('img');img.src=url;img.loading='lazy';img.decoding='async';img.alt='Foto del modello '+p.name;img.onerror=()=>{wrap.replaceChildren(placeholder())};wrap.appendChild(img)}
  else wrap.appendChild(placeholder());
  return wrap;
}
function placeholder(){const frag=document.createDocumentFragment();const ico=node('span','du-model-placeholder-icon','▣');ico.setAttribute('aria-hidden','true');frag.appendChild(ico);return frag}
const brands=[
 {brand:'Olivetti',heading:'Olivetti',subtitle:'Fotocopiatrici e multifunzioni per uffici e aziende',groups:[
  {id:'a4-bn',label:'MFP A4 B/N',detail:'Multifunzioni A4 in bianco e nero'},
  {id:'a4-colore',label:'MFP A4 Colore',detail:'Multifunzioni A4 a colori'},
  {id:'a3-bn',label:'MFP A3 B/N',detail:'Multifunzioni A3 in bianco e nero'},
  {id:'a3-colore',label:'MFP A3 Colore',detail:'Multifunzioni A3 a colori'}
 ]},
 {brand:'Ricoh',heading:'Ricoh',subtitle:'Sistemi di stampa e copia professionale in grande formato',groups:[
  {id:'wide-large-format',label:'Stampanti wide e large format',detail:'Soluzioni B/N per CAD, tavole e documenti tecnici'}
 ]},
 {brand:'Canon',heading:'Canon',subtitle:'Plotter imagePROGRAF per CAD, uffici tecnici e grafica',groups:[
  {id:'canon-plotter',label:'Plotter Canon imagePROGRAF',detail:'Stampa grande formato a colori'}
 ]}
];
function askLink(category){const a=node('a','du-model-cta','Richiedi preventivo →');a.href='index.html?esigenza='+encodeURIComponent(category==='registratori'?'Registratori telematici':'Multifunzioni')+'#richiesta';return a}
function modelCard(p){
  const item=node('details','du-model-card');
  const summary=node('summary','du-model-summary');
  summary.append(photo(p));
  const info=node('span','du-model-info');
  info.append(node('strong','du-model-name',p.name||'Modello'));
  info.append(node('span','du-model-sub',p.brand||'Olivetti'));
  summary.append(info);
  const mark=node('span','du-model-chevron','⌄');mark.setAttribute('aria-hidden','true');summary.append(mark);
  item.append(summary);
  const content=node('div','du-model-details');
  if(p.image){const larger=node('div','du-model-fullphoto');content.append(larger);
    let fullReady=false;item.addEventListener('toggle',()=>{if(item.open&&!fullReady){fullReady=true;larger.append(photo(p,true))}})}
  const copy=node('div','du-model-details-copy');
  if(p.type)copy.append(node('span','du-model-type',p.type));
  if(p.description)copy.append(node('p','',p.description));
  if(p.specs&&typeof p.specs==='string'){
    const lines=p.specs.split(/\r?\n/).map(v=>v.trim()).filter(Boolean).slice(0,30);
    if(lines.length){copy.append(node('h4','', 'Caratteristiche tecniche'));const ul=node('ul','du-model-specs');lines.forEach(line=>ul.append(node('li','',line.replace(/^[-•]\s*/,''))));copy.append(ul)}
  }
  if(p.price)copy.append(node('strong','du-model-price',p.price));
  const actions=node('div','du-model-actions');actions.append(askLink(p.category));
  if(assetUrl(p.source)){const a=node('a','du-model-source','Scheda del produttore ↗');a.href=assetUrl(p.source);a.target='_blank';a.rel='noopener noreferrer';actions.append(a)}
  copy.append(actions);content.append(copy);item.append(content);
  return item;
}
function createGroup(type,groupItems,expanded=false){
  const group=node('details','du-olivetti-group');if(expanded)group.open=true;
  const heading=node('summary','du-olivetti-group-heading');
  const name=node('span','du-olivetti-group-label');name.append(node('strong','',type.label));name.append(node('span','',type.detail));heading.append(name);
  heading.append(node('span','du-group-count',groupItems.length+(groupItems.length===1?' modello':' modelli')));
  const chevron=node('span','du-group-chevron','⌄');chevron.setAttribute('aria-hidden','true');heading.append(chevron);group.append(heading);
  const list=node('div','du-olivetti-list');group.append(list);
  let populated=false;
  function populate(){if(populated||!group.open)return;populated=true;groupItems.forEach(p=>list.append(modelCard(p)))}
  group.addEventListener('toggle',populate);
  if(expanded)populate();
  return group;
}
function drawBrands(grid,items){
  grid.classList.add('du-olivetti-groups','du-branded-catalog');grid.replaceChildren();
  const represented=new Set();
  brands.forEach(section=>{
    const sectionItems=items.filter(p=>String(p.brand||'').toLowerCase()===section.brand.toLowerCase());
    if(!sectionItems.length)return;
    const brandSection=node('section','du-brand-section du-brand-section--'+section.brand.toLowerCase());
    const header=node('div','du-brand-heading');
    const title=node('div','du-brand-title');title.append(node('h3','',section.heading));title.append(node('p','',section.subtitle));header.append(title);
    header.append(node('span','du-brand-count',sectionItems.length+(sectionItems.length===1?' modello':' modelli')));
    brandSection.append(header);
    section.groups.forEach(type=>{
      const groupItems=sectionItems.filter(p=>p.group===type.id);
      if(!groupItems.length)return;
      groupItems.forEach(p=>represented.add(p));
      brandSection.append(createGroup(type,groupItems,false));
    });
    const extra=sectionItems.filter(p=>!represented.has(p));
    if(extra.length){extra.forEach(p=>represented.add(p));brandSection.append(createGroup({id:'other',label:'Altri modelli '+section.heading,detail:'Ulteriori soluzioni disponibili'},extra,false))}
    grid.append(brandSection);
  });
  const others=items.filter(p=>!represented.has(p));
  if(others.length){const brandSection=node('section','du-brand-section');const header=node('div','du-brand-heading');const title=node('div','du-brand-title');title.append(node('h3','','Altre marche'));title.append(node('p','','Altri sistemi professionali'));header.append(title);brandSection.append(header);brandSection.append(createGroup({id:'other',label:'Altri modelli',detail:'Schede prodotto disponibili'},others,false));grid.append(brandSection)}
  if(!grid.children.length)grid.append(node('p','lead','Al momento non ci sono modelli pubblicati.'));
}
// DUEMME V72 — Catalogo registratori: tre fisarmoniche per marca, aggiornabili da JSON/Pages CMS.
const rtBrands = [
  {name:'Olivetti',slug:'olivetti',detail:'Registratori telematici Olivetti'},
  {name:'Axon',slug:'axon',detail:'Registratori telematici Axon'},
  {name:'Custom',slug:'custom',detail:'Registratori telematici Custom'}
];
function makeRegistrarAccordion(def,rows){
  const group=node('details','du-rt-brand du-rt-brand--'+def.slug);
  const summary=node('summary','du-rt-brand-heading');
  const title=node('span','du-rt-brand-title');
  title.append(node('strong','',def.name));
  title.append(node('span','',def.detail));
  summary.append(title);
  summary.append(node('span','du-rt-brand-count',rows.length?(rows.length+(rows.length===1?' modello':' modelli')):'Schede in preparazione'));
  const chev=node('span','du-rt-chevron','⌄');chev.setAttribute('aria-hidden','true');summary.append(chev);
  group.append(summary);
  const content=node('div','du-rt-brand-content');
  if(rows.length){
    const list=node('div','du-olivetti-list du-rt-model-grid');
    content.append(list);
    let populated=false;
    group.addEventListener('toggle',()=>{if(!group.open||populated)return;populated=true;rows.forEach(product=>list.append(modelCard(product)))});
  }else{
    const message=node('div','du-rt-brand-empty');
    message.append(node('p','', 'Le schede dei registratori '+def.name+' saranno disponibili prossimamente. Per modelli, configurazioni e assistenza puoi già contattare DUEMME.'));
    message.append(askLink('registratori'));
    content.append(message);
  }
  group.append(content);
  return group;
}
function drawRegistratori(grid,items){
  grid.classList.add('du-olivetti-groups','du-registratori-groups');
  grid.replaceChildren();
  const shown=new Set();
  rtBrands.forEach(def=>{
    const rows=items.filter(p=>String(p.brand||'').trim().toLowerCase()===def.name.toLowerCase());
    rows.forEach(p=>shown.add(p));
    grid.append(makeRegistrarAccordion(def,rows));
  });
  // Do not silently lose additional brands inserted later through the CMS.
  const extra=items.filter(p=>!shown.has(p));
  if(extra.length)grid.append(makeRegistrarAccordion({name:'Altri marchi',slug:'altri',detail:'Ulteriori registratori telematici'},extra));
}
function init(data){
  const entries=Array.isArray(data.items)?data.items.filter(p=>p&&p.active!==false):[];
  document.querySelectorAll('.product-grid[data-category]').forEach(grid=>{
    const rows=entries.filter(p=>p.category===grid.dataset.category);
    if(grid.dataset.category==='multifunzioni')drawBrands(grid,rows);
    else if(grid.dataset.category==='registratori')drawRegistratori(grid,rows)
  });
}
const catalogSources=["assets/data/catalogo-ufficio-olivetti.json","assets/data/catalogo-ufficio-ricoh.json","assets/data/catalogo-ufficio-canon.json","assets/data/catalogo-registratori-olivetti.json","assets/data/catalogo-registratori-axon.json","assets/data/catalogo-registratori-custom.json"];
Promise.all(catalogSources.map(path=>fetch(path,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status+' '+path);return r.json()})))
.then(parts=>({items:parts.flatMap(p=>Array.isArray(p.items)?p.items:[])}))
.catch(()=>fetch('assets/data/catalogo.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}))
.then(init).catch(()=>{document.querySelectorAll('.product-grid').forEach(grid=>{if(grid.dataset.category==='registratori')drawRegistratori(grid,[]);else grid.replaceChildren(node('p','lead','Catalogo temporaneamente non disponibile. Riprova più tardi.'))})});
})();
