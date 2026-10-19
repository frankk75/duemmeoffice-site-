/* DUEMME V67 – Catalogo DUEMME a gruppi Olivetti e Ricoh, schede espandibili e JSON gestibile da Pages CMS. */
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
const types=[
 {id:'a4-bn',label:'MFP A4 B/N',detail:'Multifunzioni A4 in bianco e nero'},
 {id:'a4-colore',label:'MFP A4 Colore',detail:'Multifunzioni A4 a colori'},
 {id:'a3-bn',label:'MFP A3 B/N',detail:'Multifunzioni A3 in bianco e nero'},
 {id:'a3-colore',label:'MFP A3 Colore',detail:'Multifunzioni A3 a colori'},
 {id:'wide-large-format',label:'Stampanti wide e large format',detail:'Soluzioni professionali per il grande formato'}
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
  if(p.image){const larger=node('div','du-model-fullphoto');larger.append(photo(p,true));content.append(larger)}
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
function drawOlivetti(grid,items){
  grid.classList.add('du-olivetti-groups');grid.replaceChildren();
  types.forEach((type,index)=>{
    const groupItems=items.filter(p=>p.group===type.id);
    if(!groupItems.length)return;
    const group=node('details','du-olivetti-group');if(index===0)group.open=true;
    const heading=node('summary','du-olivetti-group-heading');
    const name=node('span','du-olivetti-group-label');name.append(node('strong','',type.label));name.append(node('span','',type.detail));heading.append(name);
    heading.append(node('span','du-group-count',groupItems.length+' modelli'));
    const chevron=node('span','du-group-chevron','⌄');chevron.setAttribute('aria-hidden','true');heading.append(chevron);group.append(heading);
    const list=node('div','du-olivetti-list');groupItems.forEach(p=>list.append(modelCard(p)));group.append(list);
    grid.append(group);
  });
  if(!grid.children.length)grid.append(node('p','lead','Al momento non ci sono modelli pubblicati.'));
}
// Invariato il comportamento dei registratori telematici.
function registrarCard(p){
  const card=node('article','prod');card.dataset.brand=p.brand||'';
  const image=node('div','prod-photo');const url=assetUrl(p.image);
  if(url){const img=node('img');img.src=url;img.loading='lazy';img.alt='Immagine illustrativa: '+(p.name||'Prodotto');img.onerror=()=>{image.textContent='Immagine non disponibile'};image.append(img)}
  else image.textContent='Immagine non disponibile';card.append(image);
  const body=node('div','prod-body');body.append(node('span','prod-brand',p.brand||'DUEMME'));body.append(node('h3','',p.name||'Modello'));
  if(p.type)body.append(node('span','prod-type',p.type));if(p.description)body.append(node('p','',p.description));
  if(p.price)body.append(node('strong','',p.price));const links=node('div','prod-links');const a=node('a','btn','Richiedi preventivo →');a.href='index.html?esigenza=Registratori%20telematici#richiesta';links.append(a);body.append(links);card.append(body);return card;
}
function init(data){
  const entries=Array.isArray(data.items)?data.items.filter(p=>p&&p.active!==false):[];
  document.querySelectorAll('.product-grid[data-category]').forEach(grid=>{
    const rows=entries.filter(p=>p.category===grid.dataset.category);
    if(grid.dataset.category==='multifunzioni')drawOlivetti(grid,rows);
    else {grid.replaceChildren();if(rows.length)rows.forEach(p=>grid.append(registrarCard(p)));else grid.append(node('p','lead','Catalogo temporaneamente vuoto.'))}
  });
}
fetch('assets/data/catalogo.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(init).catch(()=>{document.querySelectorAll('.product-grid').forEach(grid=>{grid.replaceChildren(node('p','lead','Catalogo temporaneamente non disponibile. Riprova più tardi.'))})});
})();
