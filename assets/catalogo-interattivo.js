/* DUEMME V87 — progressive enhancement; no JSON/catalog CMS modifications. */
(()=>{'use strict';
const root=document.querySelector('.du-service-catalog');if(!root)return;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function enhance(card){
 if(card.dataset.duInteractive)return;card.dataset.duInteractive='1';
 const photo=card.querySelector('.du-model-fullphoto');
 if(!photo)return;
 let processed=false;
 const observer=new MutationObserver(()=>{
  if(processed)return;
  const img=photo.querySelector('img');if(!img)return;
  processed=true;observer.disconnect();
  img.loading='lazy';img.decoding='async';img.tabIndex=0;
  img.setAttribute('role','button');img.setAttribute('aria-label','Ingrandisci fotografia del prodotto');
  const controls=document.createElement('div');controls.className='du-v87-controls';
  const zoom=document.createElement('button');zoom.type='button';zoom.textContent='Ingrandisci fotografia +';
  controls.append(zoom);photo.append(controls);
  function show(){
   const dialog=document.createElement('dialog');dialog.className='du-v87-dialog';
   const close=document.createElement('button');close.type='button';close.textContent='Chiudi ×';close.className='du-v87-close';
   const big=img.cloneNode(false);big.removeAttribute('role');big.removeAttribute('tabindex');big.removeAttribute('aria-label');big.loading='eager';
   dialog.append(close,big);document.body.append(dialog);
   close.onclick=()=>dialog.close();
   dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
   dialog.addEventListener('close',()=>dialog.remove(),{once:true});
   try{dialog.showModal()}catch(e){dialog.remove()}
  }
  zoom.onclick=show;img.onclick=show;img.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show()}};
 });
 observer.observe(photo,{childList:true,subtree:true});
 if(photo.querySelector('img'))observer.takeRecords(),observer.disconnect(),processed=false,observer.observe(photo,{childList:true,subtree:true});
 card.addEventListener('toggle',()=>{if(card.open&&!reduce){card.classList.remove('du-v87-enter');void card.offsetWidth;card.classList.add('du-v87-enter')}});
}
const mo=new MutationObserver(()=>root.querySelectorAll('.du-model-card').forEach(enhance));
mo.observe(root,{childList:true,subtree:true});root.querySelectorAll('.du-model-card').forEach(enhance);
})();

/* V88: dynamic previews are built from the same six CMS JSON sources used by catalogo.js. */
(()=>{'use strict';
const root=document.querySelector('.du-v88');if(!root)return;
const category=root.dataset.duV88;
const paths=['catalogo-ufficio-olivetti.json','catalogo-ufficio-ricoh.json','catalogo-ufficio-canon.json','catalogo-registratori-olivetti.json','catalogo-registratori-axon.json','catalogo-registratori-custom.json'];
const brandSelect=root.querySelector('.du-v88-brand'),modelSelect=root.querySelector('.du-v88-model');
const image=root.querySelector('.du-v88-image img'),imageBox=root.querySelector('.du-v88-image');
let items=[],current=null;
const put=(selector,value)=>{root.querySelector(selector).textContent=value||''};
const options=(select,values)=>{select.replaceChildren();values.forEach(value=>{const opt=document.createElement('option');opt.value=value;opt.textContent=value;select.append(opt)})};
function display(p){current=p;if(!p)return;
 put('.du-v88-productname',p.brand||'DUEMME');put('.du-v88-type',p.type||'');put('.du-v88-name',p.name||'Modello');put('.du-v88-description',p.description||'Consulta le caratteristiche del modello.');
 const list=root.querySelector('.du-v88-specs');list.replaceChildren();
 const lines=typeof p.specs==='string'?p.specs.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).slice(0,12):[];
 if(!lines.length)lines.push('Richiedi informazioni sulle caratteristiche disponibili.');
 lines.forEach(line=>{const li=document.createElement('li');li.textContent=line.replace(/^[-•]\s*/,'');list.append(li)});
 image.hidden=!p.image;imageBox.classList.toggle('du-v88-no-image',!p.image);
 if(p.image){try{const url=new URL(p.image,document.baseURI);if(!['https:','http:'].includes(url.protocol))throw Error('url');image.src=url.href;image.alt='Foto '+(p.name||'modello')}catch(_){image.removeAttribute('src');image.hidden=true}}
 else image.removeAttribute('src');
 root.querySelector('.du-v88-enlarge').disabled=image.hidden;
 const q=new URLSearchParams({esigenza:category==='registratori'?'Registratori telematici':'Multifunzioni'});
 root.querySelector('.du-v88-cta').href='index.html?'+q.toString()+'#richiesta';
}
function refreshModels(){const brand=brandSelect.value;const matching=items.filter(p=>p.brand===brand);options(modelSelect,matching.map(p=>p.name));display(matching[0])}
brandSelect.addEventListener('change',refreshModels);
modelSelect.addEventListener('change',()=>display(items.find(p=>p.brand===brandSelect.value&&p.name===modelSelect.value)));
root.querySelector('.du-v88-enlarge').addEventListener('click',()=>{if(!current||!image.src||image.hidden)return;
 const dialog=document.createElement('dialog');dialog.className='du-v87-dialog';const close=document.createElement('button');close.type='button';close.className='du-v87-close';close.textContent='Chiudi ×';
 const big=document.createElement('img');big.src=image.src;big.alt=image.alt;dialog.append(close,big);document.body.append(dialog);
 close.addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.showModal();
});
Promise.all(paths.map(path=>fetch('assets/data/'+path,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(path);return r.json()})))
 .then(data=>data.flatMap(p=>Array.isArray(p.items)?p.items:[]))
 .catch(()=>fetch('assets/data/catalogo.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('catalogo');return r.json()}).then(p=>p.items||[]))
 .then(all=>{items=all.filter(p=>p&&p.active!==false&&p.category===category&&p.name&&p.brand);const brands=[...new Set(items.map(p=>p.brand))];if(!brands.length)throw Error('empty');options(brandSelect,brands);refreshModels()})
 .catch(()=>{root.querySelector('.du-v88-layout').hidden=true;root.querySelector('.du-v88-selectors').hidden=true;const error=root.querySelector('.du-v88-error');error.hidden=false;error.textContent='Anteprima temporaneamente non disponibile. Puoi consultare il catalogo completo qui sotto.'});
})();
