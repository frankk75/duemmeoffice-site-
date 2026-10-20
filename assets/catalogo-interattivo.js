/* DUEMME V95: catalogo interattivo unico, alimentato dai sei JSON di Pages CMS. */
(()=>{'use strict';
const root=document.querySelector('.du-v88[data-du-v88]');if(!root)return;
const category=root.dataset.duV88;
const paths=['catalogo-ufficio-olivetti.json','catalogo-ufficio-ricoh.json','catalogo-ufficio-canon.json','catalogo-registratori-olivetti.json','catalogo-registratori-axon.json','catalogo-registratori-custom.json'];
const brand=root.querySelector('.du-v88-brand'),model=root.querySelector('.du-v88-model');
const img=root.querySelector('.du-v88-image img'),empty=root.querySelector('.du-v95-empty');
const prev=root.querySelector('.du-v95-prev'),next=root.querySelector('.du-v95-next'),counter=root.querySelector('.du-v95-count'),thumbs=root.querySelector('.du-v95-thumbs');
const enlarge=root.querySelector('.du-v88-enlarge'),error=root.querySelector('.du-v88-error');
let products=[],current=null,photos=[],index=0;
function url(v){if(typeof v!=='string'||!v.trim())return '';try{const u=new URL(v,document.baseURI);return ['http:','https:'].includes(u.protocol)?u.href:''}catch(_){return ''}}
function options(select,arr){select.replaceChildren(...arr.map((o)=>{const e=document.createElement('option');e.value=o.value;e.textContent=o.label;return e}))}
function put(sel,value){root.querySelector(sel).textContent=value||''}
function renderPhoto(){
 const src=photos[index]||'';
 img.hidden=!src;empty.hidden=!!src;enlarge.disabled=!src;
 if(src){img.src=src;img.alt='Fotografia '+(index+1)+' di '+photos.length+' del modello '+current.name}else img.removeAttribute('src');
 counter.textContent=photos.length?(index+1)+' / '+photos.length:'Nessuna foto';
 prev.disabled=next.disabled=photos.length<2;
 thumbs.replaceChildren(...photos.map((src,i)=>{const b=document.createElement('button');b.type='button';b.className='du-v95-thumb'+(i===index?' is-active':'');b.setAttribute('aria-label','Mostra fotografia '+(i+1));b.setAttribute('aria-pressed',String(i===index));const pic=document.createElement('img');pic.src=src;pic.alt='';pic.loading='lazy';b.append(pic);b.addEventListener('click',()=>{index=i;renderPhoto()});return b}));
}
function show(p){current=p;if(!p)return;
 put('.du-v88-productname',p.brand);put('.du-v88-type',p.type);put('.du-v88-name',p.name);put('.du-v88-description',p.description||'Per informazioni sulle caratteristiche, contatta DUEMME.');
 const list=root.querySelector('.du-v88-specs');list.replaceChildren();
 const lines=typeof p.specs==='string'?p.specs.split(/\r?\n/).map(x=>x.trim()).filter(Boolean):[];
 for(const line of lines){const li=document.createElement('li');li.textContent=line.replace(/^[-•]\s*/,'');list.append(li)}
 if(!lines.length){const li=document.createElement('li');li.textContent='Scheda tecnica disponibile su richiesta.';list.append(li)}
 photos=[p.image,p.image2,p.image3].map(url).filter((v,i,a)=>v&&a.indexOf(v)===i).slice(0,3);index=0;renderPhoto();
 const q=new URLSearchParams({esigenza:(category==='registratori'?'Registratori telematici':'Multifunzioni')+' - '+p.brand+' '+p.name});
 root.querySelector('.du-v88-cta').href='index.html?'+q.toString()+'#richiesta';
}
function models(){const filtered=products.filter(p=>p.brand===brand.value);options(model,filtered.map(p=>({value:p.id||p.name,label:p.name})));show(filtered[0])}
brand.addEventListener('change',models);
model.addEventListener('change',()=>show(products.find(p=>p.brand===brand.value&&(p.id||p.name)===model.value)));
prev.addEventListener('click',()=>{if(photos.length>1){index=(index+photos.length-1)%photos.length;renderPhoto()}});
next.addEventListener('click',()=>{if(photos.length>1){index=(index+1)%photos.length;renderPhoto()}});
enlarge.addEventListener('click',()=>{if(!photos.length)return;
 const dialog=document.createElement('dialog');dialog.className='du-v95-dialog';
 const close=document.createElement('button');close.type='button';close.className='du-v95-close';close.textContent='Chiudi ×';
 const big=document.createElement('img');big.src=photos[index];big.alt=img.alt;
 dialog.append(close,big);document.body.append(dialog);
 const dismiss=()=>dialog.close();close.addEventListener('click',dismiss);
 dialog.addEventListener('click',e=>{if(e.target===dialog)dismiss()});
 dialog.addEventListener('close',()=>dialog.remove(),{once:true});
 try{dialog.showModal()}catch(_){dialog.remove()}
});
img.addEventListener('error',()=>{img.hidden=true;empty.hidden=false;enlarge.disabled=true});
Promise.all(paths.map(p=>fetch('assets/data/'+p,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(p);return r.json()})))
.then(arr=>arr.flatMap(d=>Array.isArray(d.items)?d.items:[]))
.catch(()=>fetch('assets/data/catalogo.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('fallback');return r.json()}).then(d=>d.items||[]))
.then(all=>{products=all.filter(p=>p&&p.active!==false&&p.category===category&&p.brand&&p.name);if(!products.length)throw Error('empty');const brands=[...new Set(products.map(p=>p.brand))];options(brand,brands.map(b=>({value:b,label:b})));models()})
.catch(()=>{root.querySelector('.du-v88-layout').hidden=true;root.querySelector('.du-v88-selectors').hidden=true;error.hidden=false;error.textContent='Il catalogo non è temporaneamente disponibile. Riprova più tardi oppure contatta DUEMME.'});
})();
