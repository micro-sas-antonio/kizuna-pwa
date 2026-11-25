/* KIZUNA 2.0 - nucleo: estado salvo, navegacao, inicio, jardim, perfil */
(function(){
"use strict";
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const VERSION="2.0", SITE="https://micro-sas-antonio.github.io/kizuna-pwa/";

/* ---------- datas ---------- */
const pad=n=>String(n).padStart(2,"0");
const iso=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const today=()=>iso(new Date());
const dnum=()=>{const d=new Date();return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()))/864e5)};
const pick=(pool,off)=>pool[(((dnum()+(off||0))%pool.length)+pool.length)%pool.length];

/* ---------- estado (salvo no aparelho) ---------- */
const KEY="kizuna2";
const DEF={names:{a:"Você",b:"Amor"},level:1,xp:0,vit:80,water:3,soil:1,streak:1,lastDay:"",species:"rose",unlocked:["rose","orchid","sakura","lavender"],
 dm:{day:"",care:0,mood:0,spin:0,bonus:0},mood:null,done:{},ciclo:null,parceiro:null,gift:{credits:1,day:"",ads:0,sent:[],recv:[]},
 roleta:{hist:{slim:[],hot:[]},feitas:0,adult:false,sorteadas:0},seen:{serie:[],filme:[],anime:[]},album:[],bg:{kind:"grad",idx:0},capsule:"",interesse:false,onboard:0};
let S=load();
function load(){try{const r=JSON.parse(localStorage.getItem(KEY)||"null");if(r)return merge(DEF,r)}catch(e){}return JSON.parse(JSON.stringify(DEF))}
function merge(d,r){const o=Array.isArray(d)?[]:{};for(const k in d){const dv=d[k],rv=r&&r[k];
  o[k]=(dv&&typeof dv==="object"&&!Array.isArray(dv))?merge(dv,rv||{}):(rv===undefined?JSON.parse(JSON.stringify(dv)):rv)}
  if(r)for(const k in r)if(!(k in o))o[k]=r[k];return o}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}

/* ---------- imagens (IndexedDB: fica salvo mesmo fechando o app) ---------- */
const IDB={db:null,open(){return this.db||(this.db=new Promise(res=>{try{const r=indexedDB.open("kizuna2",1);r.onupgradeneeded=()=>r.result.createObjectStore("img");r.onsuccess=()=>res(r.result);r.onerror=()=>res(null)}catch(e){res(null)}}))},
 async get(k){const db=await this.open();if(!db)return localStorage.getItem("img_"+k);return new Promise(res=>{const q=db.transaction("img").objectStore("img").get(k);q.onsuccess=()=>res(q.result||null);q.onerror=()=>res(null)})},
 async set(k,v){const db=await this.open();if(!db){try{localStorage.setItem("img_"+k,v)}catch(e){}return}return new Promise(res=>{const t=db.transaction("img","readwrite");t.objectStore("img").put(v,k);t.oncomplete=()=>res(1);t.onerror=()=>res(0)})},
 async del(k){const db=await this.open();if(!db){localStorage.removeItem("img_"+k);return}return new Promise(res=>{const t=db.transaction("img","readwrite");t.objectStore("img").delete(k);t.oncomplete=()=>res(1)})}};
function compress(file,max,q){return new Promise((res,rej)=>{const fr=new FileReader();fr.onerror=rej;fr.onload=()=>{const im=new Image();im.onerror=rej;im.onload=()=>{
  const s=Math.min(1,max/Math.max(im.width,im.height));const c=document.createElement("canvas");c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
  c.getContext("2d").drawImage(im,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",q||.8))};im.src=fr.result};fr.readAsDataURL(file)})}
const IMG={}; /* cache em memoria: a, b, bg */
async function loadImages(){for(const k of ["a","b","bg"]){try{IMG[k]=await IDB.get("p_"+k)}catch(e){}}applyImages()}
function applyImages(){
  [["a","avA","M"],["b","avB","A"]].forEach(([k,id,l])=>{const el=$("#"+id);const u=IMG[k];el.style.backgroundImage=u?"url("+u+")":"";el.classList.toggle("has",!!u);el.textContent=u?"":(k==="a"?(S.names.a[0]||"M"):(S.names.b[0]||"A")).toUpperCase()});
  const bg=$("#bgimg");const G=BGS[S.bg.idx]||BGS[0];
  if(S.bg.kind==="foto"&&IMG.bg){bg.style.backgroundImage="url("+IMG.bg+")";bg.style.setProperty("--ov",".5")}
  else{bg.style.backgroundImage=G;bg.style.setProperty("--ov",".15")}
}
const BGS=["linear-gradient(160deg,#2a1033,#150c1a 55%,#3a1530)","linear-gradient(160deg,#102a4a,#0c1424 60%,#2a1050)","linear-gradient(160deg,#4a1020,#1a0b12 60%,#40132a)","linear-gradient(160deg,#0f3a30,#0b1a18 60%,#1f2a50)","linear-gradient(160deg,#4a3410,#1a140b 60%,#40132a)","linear-gradient(160deg,#000,#1a1020)"];

/* ---------- toast, sheet, pagina, efeitos ---------- */
let tT;function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(tT);tT=setTimeout(()=>t.classList.remove("show"),2600)}
let shClean=null;
function openSheet(html,mount){closeSheet();const h=$("#sheetHost");h.innerHTML='<div class="scrim"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>'+html+'<button class="btn ghost block" data-x type="button">Fechar</button></div>';
  $(".scrim",h).onclick=closeSheet;$("[data-x]",h).onclick=closeSheet;if(mount)shClean=mount($(".sheet",h))||null}
function closeSheet(){if(shClean){try{shClean()}catch(e){}shClean=null}$("#sheetHost").innerHTML=""}
let pageClean=null;
function openPage(title,html,mount){const p=$("#page");p.hidden=false;p.innerHTML='<div class="ph"><button class="back" type="button" aria-label="Voltar">‹</button><h2>'+esc(title)+'</h2></div><div class="pb">'+html+'</div>';
  $(".back",p).onclick=closePage;if(pageClean){try{pageClean()}catch(e){}pageClean=null}if(mount)pageClean=mount($(".pb",p))||null}
function closePage(){const p=$("#page");if(pageClean){try{pageClean()}catch(e){}pageClean=null}p.hidden=true;p.innerHTML="";closeSheet();render(cur)}
function fx(sym,n,opt){opt=opt||{};if(reduce)n=Math.min(n,6);const box=$("#fx");const W=box.clientWidth,H=box.clientHeight;const dir=opt.dir||"up";
  for(let i=0;i<n;i++){const e=document.createElement("span");e.className="fxe";e.textContent=Array.isArray(sym)?sym[i%sym.length]:sym;
    const x=Math.random()*(W-30),d=1800+Math.random()*1600,dl=Math.random()*900,sz=20+Math.random()*28;e.style.fontSize=sz+"px";e.style.left=x+"px";
    const y0=dir==="up"?H:-40,y1=dir==="up"?-60:H+40,dx=(Math.random()*80-40);e.style.top="0";e.style.opacity="0";box.appendChild(e);
    e.animate([{transform:"translate("+0+"px,"+y0+"px) rotate(0)",opacity:0},{opacity:1,offset:.12},{transform:"translate("+dx+"px,"+y1+"px) rotate("+(Math.random()*160-80)+"deg)",opacity:.9}],{duration:d,delay:dl,easing:"ease-out",fill:"forwards"});
    setTimeout(()=>e.remove(),d+dl+100)}}

/* ---------- compartilhar (sem servidor: texto + codigo) ---------- */
function b64(o){return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function unb64(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";return JSON.parse(decodeURIComponent(escape(atob(s))))}
function makeCode(o){return "KZ1."+b64(o)}
function parseCode(txt){const m=String(txt).match(/KZ1\.([A-Za-z0-9_\-]+)/);if(!m)return null;try{return unb64(m[1])}catch(e){return null}}
async function share(text,code){
  const full=text+(code?"\n\nAbra no Kizuna: "+SITE+"#"+code:"");
  try{if(navigator.share){await navigator.share({text:full});return}}catch(e){if(e&&e.name==="AbortError")return}
  openSheet('<h3>Enviar ao parceiro</h3><p class="sm mut" style="margin-top:6px">Escolha como mandar:</p><a class="btn block" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(full)+'">Abrir no WhatsApp</a><button class="btn ghost block" type="button" id="cpy">Copiar mensagem</button>',sh=>{
    $("#cpy",sh).onclick=()=>{try{navigator.clipboard.writeText(full);toast("Copiado!")}catch(e){toast("Não consegui copiar")}}});
}
window.K={S:()=>S,save,$,$$,esc,toast,openSheet,closeSheet,openPage,closePage,fx,share,makeCode,parseCode,pick,dnum,today,iso,pad,reduce,compress,IDB,IMG,applyImages,VERSION,SITE,gain:null,go:null,render:null,ask:null,adOverlay:null};

/* ---------- confirmar / anuncio (placeholder gratis) ---------- */
function ask(msg,yes,cb){openSheet('<h3>'+esc(msg)+'</h3><button class="btn block" type="button" id="y">'+esc(yes||"Sim")+'</button>',sh=>{$("#y",sh).onclick=()=>{closeSheet();cb()}})}
/* TODO: trocar este anuncio de exemplo por um anuncio de verdade (AdMob e gratis de integrar) quando for para a Play Store */
function adOverlay(done){
  const ov=document.createElement("div");ov.className="fxcard";ov.innerHTML='<div class="adbox"><div class="xs mut" style="margin-bottom:8px">ANÚNCIO DE EXEMPLO</div><div class="ad">Aqui entra o anúncio real no futuro</div><p class="sm" style="margin-top:12px" id="adt">Aguarde 5 segundos…</p><button class="btn block" id="adx" type="button" disabled>Receber recompensa</button></div>';
  $("#app").appendChild(ov);let n=5;const b=$("#adx",ov),t=$("#adt",ov);
  const iv=setInterval(()=>{n--;if(n>0)t.textContent="Aguarde "+n+" segundos…";else{clearInterval(iv);t.textContent="Pronto! Pode pegar a recompensa.";b.disabled=false}},1000);
  b.onclick=()=>{clearInterval(iv);ov.remove();done()}}
K.ask=ask;K.adOverlay=adOverlay;

/* ---------- flores ---------- */
const SPECIES={
 rose:{n:"Rosa Carmesim Real",s:"Rosa",lvl:1,ic:"🌹",pw:"Cartão de carinho",mean:"Amor e paixão. A rosa é a forma clássica de dizer “eu te amo” sem precisar de palavras."},
 orchid:{n:"Orquídea Phalaenopsis",s:"Orquídea",lvl:1,ic:"🌺",pw:"Dica de sintonia",mean:"Delicadeza e admiração. Uma orquídea cuidada com paciência floresce por meses, como um casal que conversa todo dia."},
 sakura:{n:"Sakura Imperial",s:"Sakura",lvl:1,ic:"🌸",pw:"Ritual de desaceleração",mean:"A flor de cerejeira japonesa: a beleza do momento presente. Dura pouco, por isso se aproveita junto."},
 lavender:{n:"Lavanda Serena",s:"Lavanda",lvl:1,ic:"💜",pw:"Sono e massagem",mean:"Calma e cuidado. O cheiro da lavanda relaxa e ajuda a dormir melhor, ideal para massagem a dois."},
 sunflower:{n:"Girassol Solar",s:"Girassol",lvl:2,ic:"🌻",pw:"Desafio de energia",mean:"Alegria e lealdade. O girassol sempre vira o rosto para a luz, como quem escolhe ver o lado bom."},
 golden_jasmine:{n:"Jasmim Dourado",s:"Jasmim",lvl:3,ic:"✨",pw:"Prêmio surpresa do dia",mean:"Sorte e sedução. Seu perfume aparece mais à noite, como as melhores surpresas."},
 tulip:{n:"Tulipa Aurora",s:"Tulipa",lvl:4,ic:"🌷",pw:"Pergunta do dia",mean:"Declaração perfeita. A tulipa vermelha significa amor verdadeiro, e a conversa honesta também."},
 imperial_lily:{n:"Lírio Imperial",s:"Lírio",lvl:5,ic:"👑",pw:"Noite especial",mean:"Elegância e paixão. O lírio imperial é imponente e pede uma noite especial."},
 peony:{n:"Peônia Algodão-Doce",s:"Peônia",lvl:6,ic:"🎀",pw:"Memória do casal",mean:"Romance e felicidade no casamento. Na tradição chinesa, é a flor da prosperidade a dois."},
 hibiscus:{n:"Hibisco Tropical",s:"Hibisco",lvl:7,ic:"🏵️",pw:"Mini-aventura",mean:"Beleza ousada e delicada. Vive um dia só, então pede aventura hoje, sem esperar."},
 midnight_lotus:{n:"Lótus da Meia-Noite",s:"Lótus",lvl:8,ic:"🪷",pw:"Carta para o futuro",mean:"Renascimento e amor profundo. Cresce na água escura e floresce limpa, como o casal que atravessa os dias difíceis."}
};
const ORDER=Object.keys(SPECIES);
const PETAL={rose:"#c2185b",orchid:"#f4c6dc",sakura:"#ffc1d3",lavender:"#9b7fd1",sunflower:"#ffd21f",golden_jasmine:"#f2c94c",tulip:"#f0546f",imperial_lily:"#f6a05a",peony:"#f8b4cf",hibiscus:"#ff5a4a",midnight_lotus:"#e7a6ff"};
function flowerHTML(k,phase){return '<div class="flowerwrap" style="--open:'+({dawn:1,day:1,dusk:.68,night:.28}[phase||"day"])+';--wilt:'+(S.vit<50?1:0)+'">'+KZFlowers.svg(k)+falling(k)+'</div>'}
function falling(k){let h="";for(let i=0;i<7;i++)h+='<i class="fp" style="left:'+(8+i*13)+'%;animation-delay:'+(-i*1.3)+'s;animation-duration:'+(8+(i%3)*2)+'s;--c:'+PETAL[k]+'"></i>';return h}
const phaseNow=()=>{const h=new Date().getHours();return h>=5&&h<10?"dawn":h<17?"day":h<20?"dusk":"night"};
const CAPS={dawn:"🌅 Manhã: a flor acordou.",day:"☀️ Dia: a flor está aberta.",dusk:"🌇 Entardecer: a flor começa a se recolher.",night:"🌙 Noite: a flor está dormindo."};

/* conteudo diario de cada flor */
function powerFor(k){
 switch(k){
  case"rose":return{t:"Frase de carinho",b:"“"+pick(LOVE)+".” Diga hoje com a sua voz ou mande por mensagem.",share:pick(LOVE)};
  case"orchid":return pick(ORCHID);
  case"sakura":{const r=pick(SAKURA);return{t:r.t,b:r.d,steps:r.steps}}
  case"lavender":{const r=pick(LAVENDER);return{t:r.t,b:r.d}}
  case"sunflower":return pick(SUN);
  case"golden_jasmine":return{t:"Prêmio de hoje",b:pick(PRIZES)+". Cumpra com carinho!"};
  case"tulip":return{t:"Uma pergunta para os dois",b:pick(TULIP)};
  case"imperial_lily":return pick(LILY);
  case"peony":return{t:"Vamos lembrar juntos",b:pick(PEONY)};
  case"hibiscus":return pick(ADVENT);
 }return{t:"Carta para daqui a 30 dias",b:""}}
function flowerPage(k){
  const sp=SPECIES[k],un=S.unlocked.includes(k),on=S.species===k;
  openSheet('<div class="bigflower">'+flowerHTML(k,"day")+'</div><div class="row sp" style="margin-top:12px"><div><h3>'+sp.ic+" "+esc(sp.n)+'</h3><span class="xs mut">'+(sp.lvl>1?"Rara · liberada no nível "+sp.lvl:"Flor inicial")+'</span></div>'+(on?'<span class="pill">PLANTADA</span>':!un?'<span class="pill" style="background:#ffffff22;color:#fff">🔒 Nível '+sp.lvl+'</span>':'')+'</div>'+
   '<p class="sm" style="margin-top:8px">'+esc(sp.mean)+'</p><div class="hr"></div><b class="sm">Poder: '+esc(sp.pw)+'</b><p class="sm mut">Muda todo dia e dá XP quando vocês fazem.</p>'+
   (un?'<button class="btn ghost block" type="button" id="pw">Ver o poder de hoje</button>':'<p class="sm mut" style="margin-top:6px">Suba até o nível '+sp.lvl+' para abrir o poder desta flor.</p>')+
   (un&&!on?'<button class="btn block" type="button" id="plant">Plantar esta flor 🌱</button>':'')+
   (!un?'<p class="sm" style="margin-top:8px">Você está no nível '+S.level+'. Ganhe XP regando, fazendo check-in e cumprindo roletas.</p>':''),sh=>{
    const p=$("#plant",sh);if(p)p.onclick=()=>{S.species=k;save();toast(sp.s+" plantada!");closeSheet();render("jardim")};
    const w=$("#pw",sh);if(w)w.onclick=()=>powerSheet(k)})}
function powerSheet(k){
  const sp=SPECIES[k],pw=powerFor(k),dk="pw_"+k+"@"+today(),did=S.done[dk];
  if(k==="midnight_lotus"){openSheet('<h3>🪷 Carta para daqui a 30 dias</h3><p class="sm mut">Escreva para vocês dois lerem no futuro. Fica guardada aqui.</p><textarea class="field" id="cap" rows="5" placeholder="Daqui a 30 dias quero lembrar de…">'+esc(S.capsule)+'</textarea><button class="btn block" id="seal" type="button">Guardar carta (+10 XP)</button>',sh=>{
    $("#seal",sh).onclick=()=>{S.capsule=$("#cap",sh).value;save();closeSheet();if(!did){S.done[dk]=1;gain(10,3)}toast("Carta guardada")}});return}
  openSheet('<h3>'+sp.ic+" "+esc(sp.pw)+'</h3><p class="xs mut">Hoje · amanhã tem outro</p><p style="font-weight:700;margin:10px 0 4px;font-size:17px">'+esc(pw.t)+'</p><p>'+esc(pw.b)+'</p>'+(pw.steps?'<ol class="sm">'+pw.steps.map(s=>"<li>"+esc(s)+"</li>").join("")+'</ol>':'')+
   (pw.share?'<button class="btn ghost block" id="shr" type="button">Mandar esta frase</button>':'')+'<button class="btn block" id="ok" type="button">'+(did?"Já feito hoje ✓":"Fizemos! (+10 XP)")+'</button>',sh=>{
    if(pw.share)$("#shr",sh).onclick=()=>share("🌹 "+pw.share+" ("+S.names.a+")");
    $("#ok",sh).onclick=()=>{closeSheet();if(!did){S.done[dk]=1;gain(10,3);fx("✨",8)}}})}

/* ---------- XP e niveis ---------- */
function gain(xp,vit){
  S.xp+=xp;S.vit=Math.min(100,S.vit+(vit||0));const newly=[];let up=false;
  while(S.xp>=100){S.xp-=100;S.level++;up=true}
  ORDER.forEach(k=>{if(SPECIES[k].lvl<=S.level&&!S.unlocked.includes(k)){S.unlocked.push(k);newly.push(k)}});
  save();renderTop();if(cur==="inicio"||cur==="jardim")render(cur);
  if(newly.length){const k=newly[0];setTimeout(()=>{fx(["🎉","✨","💖"],16);openSheet('<h3 style="text-align:center">Nível '+S.level+'! Flor nova 🎉</h3><p style="font-size:60px;text-align:center;margin:8px 0">'+SPECIES[k].ic+'</p><p style="text-align:center"><b>'+esc(SPECIES[k].n)+'</b></p><button class="btn block" id="ver" type="button">Ver a flor</button>',sh=>{$("#ver",sh).onclick=()=>{flowerPage(k)}})},500)}
  else if(up){toast("Subiram para o nível "+S.level+"! 🎉");fx("⭐",10)}
}
K.gain=gain;
function missionDone(key,xp){if(S.dm[key])return;S.dm[key]=1;const all=S.dm.care&&S.dm.mood&&S.dm.spin;if(all&&!S.dm.bonus){S.dm.bonus=1;gain(30,5);toast("Missões do dia completas! +30 XP");fx(["🏆","💖"],14)}save()}
K.missionDone=missionDone;

/* ---------- rollover diario ---------- */
function rollover(){
  const t=today();if(S.lastDay===t)return;
  const y=new Date();y.setDate(y.getDate()-1);
  S.streak=S.lastDay===iso(y)?S.streak+1:1;S.lastDay=t;
  S.water=Math.max(S.water,3);S.soil=1;S.vit=Math.max(30,S.vit-(S.streak===1?25:0));
  S.dm={day:t,care:0,mood:0,spin:0,bonus:0};S.mood=null;
  if(S.gift.day!==t){S.gift.day=t;S.gift.ads=0;if(S.gift.credits<1)S.gift.credits=1}
  save();
}

/* ---------- navegacao ---------- */
let cur="inicio";
const VIEWS=["inicio","jardim","roleta","noite","perfil"];
function go(v){cur=v;closeSheet();if(!$("#page").hidden){$("#page").hidden=true;$("#page").innerHTML=""}
  $$("#nav button").forEach(b=>b.classList.toggle("on",b.dataset.v===v));VIEWS.forEach(k=>$("#v-"+k).hidden=k!==v);$("#main").scrollTop=0;render(v)}
function render(v){const f=R[v];if(f)f($("#v-"+v));renderTop()}
K.go=go;K.render=render;
$$("#nav button").forEach(b=>b.onclick=()=>go(b.dataset.v));
function renderTop(){
  $("#coupleName").textContent=S.names.a+" & "+S.names.b;
  $("#topSub").textContent="Nível "+S.level+" · "+S.xp+"/100 XP";$("#streakN").textContent=S.streak;
  applyImages();
}
$("#flame").onclick=()=>toast("🔥 "+S.streak+(S.streak===1?" dia":" dias seguidos")+" usando o Kizuna!");

/* ---------- INICIO ---------- */
const MOODS=[
 {k:"feliz",ic:"🤩",l:"Ótimo",tip:"Dia ótimo! Aproveitem a energia: girem a roleta e planejem algo especial para hoje à noite."},
 {k:"ok",ic:"🙂",l:"Bem",tip:"Dia tranquilo. Que tal um carinho simples: um elogio e um abraço longo?"},
 {k:"corrido",ic:"🏃",l:"Corrido",tip:"Dia corrido. Um chá calmante ou 5 minutos de massagem nos ombros quando se encontrarem ajuda muito."},
 {k:"cansado",ic:"😮‍💨",l:"Cansado",tip:"Energia baixa. Hoje é dia de colo e zero cobranças: banho morno, massagem nos pés e filme em casa."},
 {k:"carente",ic:"🥺",l:"Carente",tip:"Quer um carinho extra. Mande uma mensagem fofa, um presente animado ou planeje a noite de vocês."}
];
const R={};
R.inicio=function(el){
  const h=new Date().getHours(),g=h<12?"Bom dia":h<18?"Boa tarde":"Boa noite";
  const dm=S.dm,n=(dm.care?1:0)+(dm.mood?1:0)+(dm.spin?1:0);
  const mood=MOODS.find(m=>m.k===S.mood);
  const cy=window.KZ_cicloHoje&&KZ_cicloHoje();
  const recv=S.gift.recv.filter(g=>!g.visto).length;
  const tip=pick([].concat(ORCHID,SUN),0);
  el.innerHTML='<div class="hello"><h2>'+g+(S.onboard?", "+esc(S.names.a):"")+' 💕</h2><p class="sm mut">Toque em qualquer cartão. Tudo aqui é para os dois.</p></div>'+
  '<div class="card"><div class="row sp"><h3>Missões de hoje</h3><span class="pill">'+n+'/3</span></div><div class="bar" style="margin:8px 0 4px"><i style="width:'+(n/3*100)+'%"></i></div>'+
   '<div class="mission'+(dm.mood?" done":"")+'"><span class="ck">'+(dm.mood?"✓":"")+'</span><b class="sm">Contar como você está</b></div>'+
   '<div class="mission'+(dm.care?" done":"")+'"><span class="ck">'+(dm.care?"✓":"")+'</span><b class="sm">Cuidar da flor</b><button class="chip" data-go="jardim" type="button">Ir</button></div>'+
   '<div class="mission'+(dm.spin?" done":"")+'"><span class="ck">'+(dm.spin?"✓":"")+'</span><b class="sm">Girar a roleta e cumprir</b><button class="chip" data-go="roleta" type="button">Ir</button></div>'+
   '<p class="xs mut" style="margin-top:6px">As 3 juntas valem +30 XP de bônus.</p></div>'+
  '<div class="card"><h3>Como você está hoje?</h3><div class="moods">'+MOODS.map(m=>'<button type="button" data-m="'+m.k+'" class="'+(S.mood===m.k?"on":"")+'">'+m.ic+'<small>'+m.l+'</small></button>').join("")+'</div>'+
   (mood?'<div class="tipbox" style="margin-top:12px"><b>Dica para o(a) '+esc(S.names.b)+'</b><span class="sm">'+esc(mood.tip)+'</span></div><button class="btn ghost block" id="sendMood" type="button">Enviar ao '+esc(S.names.b)+'</button>':'')+'</div>'+
  '<div class="tiles">'+
   '<button class="tile" data-open="roleta-slim" type="button"><span class="i">🎡</span>Roleta Slim<span class="nb">tarefas leves</span></button>'+
   '<button class="tile hot" data-open="roleta-hot" type="button"><span class="i">🔥</span>Roleta Hot<span class="nb">18+ a dois</span></button>'+
   '<button class="tile" data-open="ciclo" type="button"><span class="i">🌙</span>Ciclo<span class="nb">dicas por fase</span></button>'+
   '<button class="tile" data-open="presentes" type="button"><span class="i">🎁</span>Presentes<span class="nb">'+(recv?recv+" novo(s)!":"enviar carinho")+'</span></button>'+
   '<button class="tile" data-open="album" type="button"><span class="i">📸</span>Álbum<span class="nb">polaroids</span></button>'+
   '<button class="tile" data-go="noite" type="button"><span class="i">🎬</span>Filme/Série<span class="nb">sorteio</span></button></div>'+
  (cy?'<button class="card" data-open="ciclo" type="button" style="width:100%;text-align:left;display:block"><div class="row sp"><b>'+cy.ic+' '+esc(cy.titulo)+'</b><span class="xs mut">ver tudo ›</span></div><p class="sm" style="margin-top:6px">'+esc(cy.dica.t)+': '+esc(cy.dica.b)+'</p></button>':'')+
  '<div class="card"><div class="row sp"><h3>Dica de hoje</h3></div><div class="tipbox"><b>'+esc(tip.t)+'</b><span class="sm">'+esc(tip.b)+'</span></div><button class="btn ghost block" id="tipOk" type="button">'+(S.done["tip@"+today()]?"Já feito ✓":"Fizemos! +10 XP")+'</button></div>'+
  '<p class="xs mut" style="text-align:center;margin-top:14px">Kizuna '+VERSION+' · by VŌLVA</p>';
  $$("[data-go]",el).forEach(b=>b.onclick=()=>go(b.dataset.go));
  $$("[data-open]",el).forEach(b=>b.onclick=()=>K.open(b.dataset.open));
  $$("[data-m]",el).forEach(b=>b.onclick=()=>{S.mood=b.dataset.m;save();if(!S.dm.mood){missionDone("mood");gain(10,2);fx("💖",6)}render("inicio")});
  const sm=$("#sendMood",el);if(sm)sm.onclick=()=>share(S.names.a+" está "+mood.l.toLowerCase()+" hoje "+mood.ic+"\n"+mood.tip);
  $("#tipOk",el).onclick=()=>{const k="tip@"+today();if(S.done[k])return;S.done[k]=1;gain(10,3);fx("✨",8)};
};

/* ---------- JARDIM ---------- */
let phase=null;
R.jardim=function(el){
  const p=phase||phaseNow(),sp=SPECIES[S.species];
  el.innerHTML='<div class="garden ph-'+p+'" id="garden"><span class="gtag">'+sp.ic+" "+esc(sp.n)+'</span><div class="phbtns" id="phb">'+[["dawn","🌅"],["day","☀️"],["dusk","🌇"],["night","🌙"]].map(a=>'<button data-p="'+a[0]+'" class="'+(a[0]===p?"on":"")+'" type="button" aria-label="'+a[0]+'">'+a[1]+'</button>').join("")+'</div>'+flowerHTML(S.species,p)+'</div>'+
  '<p class="xs mut" style="margin-top:6px;text-align:center">'+CAPS[p]+'</p>'+
  '<div class="care"><button type="button" id="cWater"><span class="i">💧</span>Regar<small>'+S.water+' hoje · +15 XP</small></button><button type="button" id="cSoil"><span class="i">🪴</span>Adubar<small>'+S.soil+' hoje · +20 XP</small></button></div>'+
  '<div class="card"><div class="row sp"><b class="sm">Nível '+S.level+'</b><span class="xs mut">'+S.xp+'/100 XP</span></div><div class="bar" style="margin:6px 0"><i style="width:'+S.xp+'%"></i></div><div class="row sp"><b class="sm">Vitalidade</b><span class="xs mut">'+S.vit+'%</span></div><div class="bar" style="margin-top:6px"><i style="width:'+S.vit+'%"></i></div></div>'+
  '<div class="card"><h3>Coleção de flores</h3><p class="xs mut">Toque numa flor para abrir a página dela.</p><div class="coll">'+ORDER.map(k=>{const s=SPECIES[k],un=S.unlocked.includes(k);return '<button type="button" class="fcard'+(S.species===k?" cur":"")+(un?"":" lock")+'" data-f="'+k+'"><span class="i">'+s.ic+'</span><b>'+s.s+'</b><small>'+(un?(S.species===k?"plantada":"liberada"):"🔒 nível "+s.lvl)+'</small></button>'}).join("")+'</div></div>';
  $$("#phb button",el).forEach(b=>b.onclick=()=>{phase=b.dataset.p;R.jardim(el)});
  $$("[data-f]",el).forEach(b=>b.onclick=()=>flowerPage(b.dataset.f));
  const g=$("#garden"),fw=$(".flowerwrap",el);
  /* arrastar inclina a flor */
  let x0=null;fw.addEventListener("pointerdown",e=>{x0=e.clientX});fw.addEventListener("pointermove",e=>{if(x0!==null)fw.style.setProperty("--tilt",Math.max(-14,Math.min(14,(e.clientX-x0)*.25))+"deg")});
  const up=()=>{x0=null;fw.style.setProperty("--tilt","0deg")};fw.addEventListener("pointerup",up);fw.addEventListener("pointercancel",up);
  const rain=s=>{for(let i=0;i<7;i++){const d=document.createElement("span");d.className="drop";d.textContent=s;d.style.left=(35+Math.random()*30)+"%";d.style.top=(15+Math.random()*15)+"%";d.style.animationDelay=(i*70)+"ms";g.appendChild(d);setTimeout(()=>d.remove(),1400)}const sv=$("svg",fw);sv.classList.remove("bump");void sv.getBoundingClientRect();sv.classList.add("bump")};
  $("#cWater",el).onclick=()=>{
    if(S.water<=0){openSheet('<h3>Acabou a água de hoje 💧</h3><p class="sm mut" style="margin-top:6px">Veja um anúncio rápido para ganhar +1 regada.</p><button class="btn block" id="ad" type="button">Ver anúncio</button>',sh=>{$("#ad",sh).onclick=()=>{closeSheet();adOverlay(()=>{S.water++;save();toast("+1 regada 💧");render("jardim")})}});return}
    S.water--;S.vit=Math.min(100,S.vit+10);rain("💧");toast("💧 Regado! +15 XP");missionDone("care");gain(15,10)};
  $("#cSoil",el).onclick=()=>{if(S.soil<=0){toast("Hoje já adubaram. Amanhã tem mais!");return}S.soil--;rain("🟤");toast("🪴 Terra nova! +20 XP");missionDone("care");gain(20,6)};
};

/* ---------- PERFIL ---------- */
let deferred=null;
addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferred=e});
R.perfil=function(el){
  el.innerHTML='<div class="card"><h3>Nós dois</h3>'+
   '<label class="lb">Seu nome</label><input class="field" id="nA" maxlength="18" value="'+esc(S.names.a)+'"><label class="lb">Nome do seu amor</label><input class="field" id="nB" maxlength="18" value="'+esc(S.names.b)+'">'+
   '<div class="row" style="margin-top:12px"><button class="btn ghost" id="pA" type="button">📷 Minha foto</button><button class="btn ghost" id="pB" type="button">📷 Foto do amor</button></div>'+
   '<p class="xs mut" style="margin-top:6px">As fotos ficam salvas no seu celular, mesmo fechando o app.</p></div>'+
  '<div class="card"><h3>Fundo do app</h3><div class="chips" id="bgs">'+BGS.map((g,i)=>'<button class="chip" type="button" data-b="'+i+'" style="width:44px;height:44px;border-radius:12px;background:'+g+';'+((S.bg.kind==="grad"&&S.bg.idx===i)?"outline:2px solid #fff":"")+'"></button>').join("")+'</div>'+
   '<div class="row" style="margin-top:10px"><button class="btn ghost" id="pBg" type="button">🖼️ Usar uma foto</button>'+(IMG.bg?'<button class="btn ghost" id="rBg" type="button">Tirar foto</button>':'')+'</div></div>'+
  '<div class="card"><h3>Planos</h3><p class="sm">7 dias grátis para testar tudo. Depois:</p><div class="row sp" style="margin-top:8px"><span>Individual</span><b>R$ 20/mês</b></div><div class="row sp"><span>Casal</span><b>R$ 30/mês</b></div><p class="xs mut" style="margin-top:6px">Por enquanto o app é todo grátis. A cobrança só começa quando for para a Play Store.</p></div>'+
  '<div class="card"><h3>Receber algo do amor</h3><p class="sm mut">Se recebeu um presente ou o ciclo por mensagem, cole o código aqui:</p><textarea class="field" id="code" rows="2" placeholder="Cole aqui o texto recebido"></textarea><button class="btn block" id="useCode" type="button">Usar código</button></div>'+
  '<div class="card"><h3>Sobre</h3><p class="sm">Kizuna '+VERSION+' by VŌLVA</p><div class="row" style="margin-top:8px">'+(deferred?'<button class="btn ghost" id="inst" type="button">📥 Instalar no celular</button>':'')+'<button class="btn ghost" id="reset" type="button">Apagar meus dados</button></div></div>';
  const nm=()=>{S.names.a=$("#nA",el).value.trim()||"Você";S.names.b=$("#nB",el).value.trim()||"Amor";save();renderTop()};
  $("#nA",el).oninput=nm;$("#nB",el).oninput=nm;
  const pickImg=(key,max)=>{const i=document.createElement("input");i.type="file";i.accept="image/*";i.onchange=async()=>{const f=i.files[0];if(!f)return;try{const u=await compress(f,max,.82);IMG[key]=u;await IDB.set("p_"+key,u);if(key==="bg"){S.bg.kind="foto";save()}applyImages();toast("Foto salva ✓");R.perfil(el)}catch(e){toast("Não consegui abrir essa foto")}};i.click()};
  $("#pA",el).onclick=()=>pickImg("a",480);$("#pB",el).onclick=()=>pickImg("b",480);$("#pBg",el).onclick=()=>pickImg("bg",1000);
  const rb=$("#rBg",el);if(rb)rb.onclick=async()=>{IMG.bg=null;await IDB.del("p_bg");S.bg.kind="grad";save();applyImages();R.perfil(el)};
  $$("[data-b]",el).forEach(b=>b.onclick=()=>{S.bg={kind:"grad",idx:+b.dataset.b};save();applyImages();R.perfil(el)});
  $("#useCode",el).onclick=()=>{const c=K.useCode($("#code",el).value);if(!c)toast("Não achei um código válido nesse texto")};
  const ins=$("#inst",el);if(ins)ins.onclick=()=>{deferred.prompt();deferred=null};
  $("#reset",el).onclick=()=>ask("Apagar tudo e começar do zero?","Sim, apagar",async()=>{localStorage.removeItem(KEY);for(const k of ["p_a","p_b","p_bg"])await IDB.del(k);location.reload()});
};

K.open=function(id){
  if(id==="roleta-slim"||id==="roleta-hot"){K.roletaModo=id==="roleta-hot"?"hot":"slim";go("roleta");return}
  if(K.pages[id])K.pages[id]();
};
K.pages={};K.R=R;K.getCur=()=>cur;

/* ---------- inicio ---------- */
function boot(){
  rollover();
  R.noite=R.noite||function(){};R.roleta=R.roleta||function(){};
  go("inicio");loadImages();
  try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
  if(K.afterBoot)K.afterBoot();
  if("serviceWorker" in navigator&&location.protocol.startsWith("http"))addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
window.K.boot=boot;
})();
