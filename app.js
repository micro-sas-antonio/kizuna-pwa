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
const dnum=()=>{const d=new Date();return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()))/864e5)+((typeof S!=="undefined"&&S&&S.dayOffset)||0)};
const pick=(pool,off)=>pool[(((dnum()+(off||0))%pool.length)+pool.length)%pool.length];

/* ---------- estado (salvo no aparelho) ---------- */
const KEY="kizuna2";
const DEF={names:{a:"Você",b:"Amor"},level:1,xp:0,vit:80,water:3,soil:1,streak:1,lastDay:"",species:"rose",unlocked:["rose","orchid","sakura","lavender"],
 dm:{day:"",care:0,mood:0,spin:0,bonus:0},mood:null,done:{},ciclo:null,parceiro:null,gift:{credits:1,day:"",ads:0,sent:[],recv:[]},
 roleta:{hist:{slim:[],hot:[]},feitas:0,adult:false,sorteadas:0},seen:{serie:[],filme:[],anime:[]},album:[],bg:{kind:"grad",idx:0},capsule:"",interesse:false,onboard:0,pair:{topic:"",me:"",since:0,last:"",lastMsg:null},role:"",adk:{},streams:[],dayOffset:0,special:0,plan:"free_slim",trial:null,invite:null,widget:false,prefs:{checkin:true,tips:true,quiet:true},secret:null,secretIn:null,viewed:{},mi:0};
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
const THEMES=[{n:"Noite",lvl:1,g:"linear-gradient(160deg,#2a1033,#150c1a 55%,#3a1530)"},{n:"Dia floral",lvl:1,g:"linear-gradient(160deg,#7a2f55,#3a1830 60%,#a04070)"},{n:"Aurora",lvl:3,g:"linear-gradient(160deg,#0f3a30,#0b1a18 60%,#1f6a60)"},{n:"Sakura ao entardecer",lvl:4,g:"linear-gradient(160deg,#6b2b4a,#2a1020 55%,#8a4060)"},{n:"Ouro imperial",lvl:6,g:"linear-gradient(160deg,#4a3410,#1a140b 60%,#a07a20)"},{n:"Lótus da meia-noite",lvl:8,g:"linear-gradient(160deg,#1c1b4d,#0d0a2a 60%,#6a4bd1)"},{n:"Oceano",lvl:2,g:"linear-gradient(160deg,#102a4a,#0c1424 60%,#2a6aa0)"},{n:"Vinho",lvl:5,g:"linear-gradient(160deg,#4a1020,#1a0b12 60%,#7a1f3a)"},{n:"Pôr do sol",lvl:7,g:"linear-gradient(160deg,#4a2a10,#2a1020 60%,#d9667a)"},{n:"Preto elegante",lvl:9,g:"linear-gradient(160deg,#000,#1a1020)"}];
const BGS=THEMES.map(t=>t.g);

/* ---------- toast, sheet, pagina, efeitos ---------- */
let tT;function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(tT);tT=setTimeout(()=>t.classList.remove("show"),2600)}
let shClean=null;
function openSheet(html,mount){closeSheet();const h=$("#sheetHost");h.innerHTML='<div class="scrim"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>'+html+'<button class="btn ghost block" data-x type="button">Fechar</button></div>';
  $(".scrim",h).onclick=closeSheet;$("[data-x]",h).onclick=closeSheet;if(mount)shClean=mount($(".sheet",h))||null}
function closeSheet(){if(shClean){try{shClean()}catch(e){}shClean=null}$("#sheetHost").innerHTML=""}
let pageClean=null;
const EMB={"Presentes 🎁":"presentes","Linha Hot 🔥":"hot","Ciclo e dicas 🌙":"ciclo"};
function openPage(title,html,mount){const ev=EMB[title];
  if(ev&&cur===ev){const e=$("#v-"+ev);if(pageClean){try{pageClean()}catch(x){}pageClean=null}$("#page").hidden=true;e.innerHTML='<h2 style="margin:12px 2px 0;font-size:22px">'+esc(title)+'</h2>'+html;if(mount)pageClean=mount(e)||null;return}
  const p=$("#page");p.hidden=false;p.innerHTML='<div class="ph"><button class="back" type="button" aria-label="Voltar">‹</button><h2>'+esc(title)+'</h2></div><div class="pb">'+html+'</div>';
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
  if(K.relayOn&&K.relayOn()){const ok=await K.relaySend(text,code);if(ok){toast("Enviado ao parceiro ✓");return}toast("Sem internet: vou abrir o compartilhamento")}
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
   (!un?'<p class="sm" style="margin-top:8px">Você está no nível '+S.level+'. Suba de nível ou assista 3 anúncios para abrir esta flor.</p><button class="btn ghost block" id="adu" type="button">📺 Assistir anúncio ('+(S.adk[k]||0)+'/3)</button>':''),sh=>{
    const p=$("#plant",sh);if(p)p.onclick=()=>{S.species=k;save();toast(sp.s+" plantada!");closeSheet();render("jardim")};
    const au=$("#adu",sh);if(au)au.onclick=()=>{closeSheet();adOverlay(()=>{S.adk[k]=(S.adk[k]||0)+1;if(S.adk[k]>=3){S.unlocked.push(k);toast(sp.s+" liberada! 🎉");fx("🎉",14)}else toast("Anúncio "+S.adk[k]+"/3");save();flowerPage(k);render(cur)})};
    const w=$("#pw",sh);if(w)w.onclick=()=>(K.openPower||powerSheet)(k)})}
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
K.gain=gain;K.SPECIES=SPECIES;K.ORDER=ORDER;K.powerFor=powerFor;K.flowerPage=flowerPage;K.flowerHTML=flowerHTML;K.phaseNow=phaseNow;
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
let cur="jardim";
const VIEWS=["jardim","roleta","noite","presentes","hot","ciclo","perfil"];
function go(v){cur=v;closeSheet();if(!$("#page").hidden){$("#page").hidden=true;$("#page").innerHTML=""}
  $$("#nav button").forEach(b=>b.classList.toggle("on",b.dataset.v===v));VIEWS.forEach(k=>$("#v-"+k).hidden=k!==v);$("#main").scrollTop=0;render(v)}
function render(v){const f=R[v];if(f)f($("#v-"+v));renderTop();if(K.widgetSync)K.widgetSync()}
K.go=go;K.render=render;
$$("#nav button").forEach(b=>b.onclick=()=>go(b.dataset.v));
function renderTop(){
  $("#coupleName").textContent=S.names.a+" & "+S.names.b;
  $("#topSub").textContent="Nível "+S.level+" · "+S.xp+"/100 XP";$("#streakN").textContent=S.streak;$("#navCiclo").hidden=S.role!=="ela";
  applyImages();
}
$("#topPair").onclick=()=>go("perfil");$("#gear").onclick=()=>go("perfil");
$("#flame").onclick=()=>toast("🔥 "+S.streak+(S.streak===1?" dia":" dias seguidos")+" usando o Kizuna!");

/* ---------- INICIO ---------- */
const MOODS=[
 {k:"feliz_energico",ic:"🤩",l:"Ótimo",tip:"Energia lá em cima! Aproveitem para escolher um plano especial e girar a roleta hoje à noite.",mission:"Escolher juntos o Plano da Noite e girar a roleta.",prod:["Kit Descoberta Sensorial VŌLVA","Para variar a rotina com novas texturas e aromas."]},
 {k:"ok",ic:"🙂",l:"Bem",tip:"Dia tranquilo. Que tal um carinho simples: um elogio e um abraço longo?",mission:"Um elogio sincero e um abraço de 20 segundos.",prod:["Vela Aromática de Massagem VŌLVA","Vira óleo morno depois de acesa."]},
 {k:"corrido",ic:"🏃",l:"Corrido",tip:"Dia corrido. Um chá calmante ou 5 minutos de massagem nos ombros quando se encontrarem ajuda muito.",mission:"Massagem cervical de 5 minutos + chá de camomila.",prod:["Óleo Térmico Relaxante VŌLVA","Aquece de leve e ajuda a soltar a tensão dos ombros."]},
 {k:"cansado",ic:"😮‍💨",l:"Cansado",tip:"Energia baixa. Hoje é dia de colo e zero cobranças: banho morno, massagem nos pés e filme em casa.",mission:"Escalda-pés morno + massagem nos pés antes de assistirem algo juntos.",prod:["Kit Spa Noturno VŌLVA","Sais de banho e óleo para os pés."]},
 {k:"estresse_alto",ic:"🤯",l:"Estresse",tip:"Dia estressante. Um abraço longo de 20 segundos ajuda a acalmar.",mission:"Abraço silencioso de 20 segundos + ambiente à meia-luz.",prod:["Vela Aromática de Massagem VŌLVA","Vira óleo morno para massagem depois de acesa."]},
 {k:"carente",ic:"🥺",l:"Carente",tip:"Quer um carinho extra. Mande uma mensagem fofa, um presente animado ou planeje a noite de vocês.",mission:"Enviar um presente animado e montar o Plano da Noite.",prod:["Óleo Beijável Sensorial VŌLVA","Aroma suave para um momento a dois."]}
];
K.MOODS=MOODS;const R={};
/* check-in do dia: aparece na primeira abertura do dia e ja manda a mensagem ao parceiro */
function dailyCheckin(done){
  if(S.dm.asked){done&&done();return}
  const ov=document.createElement("div");ov.className="fxcard";
  ov.innerHTML='<h2 style="font-family:Georgia,serif">Como você está hoje? 💕</h2><p class="sm mut">Toque em como se sente. Seu amor recebe uma mensagem com um jeito de cuidar de você.</p><div class="moods" style="width:100%">'+MOODS.map(m=>'<button type="button" data-m="'+m.k+'">'+m.ic+'<small>'+m.l+'</small></button>').join("")+'</div><button class="chip" id="skip" type="button">Agora não</button>';
  $("#app").appendChild(ov);
  $("#skip",ov).onclick=()=>{S.dm.asked=1;save();ov.remove();done&&done()};
  $$("[data-m]",ov).forEach(b=>b.onclick=async()=>{const m=MOODS.find(x=>x.k===b.dataset.m);S.dm.asked=1;S.mood=m.k;save();ov.remove();
    if(!S.dm.mood){missionDone("mood");gain(10,2);fx("💖",8)}
    try{await share("💛 "+S.names.a+" está "+m.l.toLowerCase()+" hoje "+m.ic+"\n"+m.tip+"\n\nMissão de cuidado para você realizar em "+S.names.a+": "+m.mission,makeCode({t:"m",n:S.names.a,l:m.l,mi:m.mission,p:m.prod}))}catch(e){}
    done&&done()})}
function dailyTip(){
  if(S.dm.tipSeen)return;S.dm.tipSeen=1;save();
  const tp=pick([].concat(ORCHID,SUN),0);
  openSheet('<h3>☀️ Dica de hoje</h3><div class="tipbox" style="margin-top:8px"><b>'+esc(tp.t)+'</b><span class="sm">'+esc(tp.b)+'</span></div><button class="btn block" id="tk" type="button">Fizemos! (+10 XP)</button>',sh=>{$("#tk",sh).onclick=()=>{closeSheet();const k="tip@"+today();if(!S.done[k]){S.done[k]=1;gain(10,3);fx("✨",8)}}})}
K.dailyFlow=()=>dailyCheckin(dailyTip);

/* ---------- JARDIM ---------- */
let phase=null;
const BASE=ORDER.slice(0,4),RARE=ORDER.slice(4);
function fcard(k){const sp=SPECIES[k],un=S.unlocked.includes(k);return '<button type="button" class="fcard'+(S.species===k?" cur":"")+(un?"":" lock")+'" data-f="'+k+'"><span class="i">'+sp.ic+'</span><b>'+sp.s+'</b><small>'+(S.species===k?"plantada":un?"liberada":"🔒 nível "+sp.lvl)+'</small></button>'}
function rareSheet(){
  openSheet('<h3>✨ Flores raras</h3><p class="sm mut">Abra subindo de nível ou assistindo anúncios (3 por flor).</p><div class="coll">'+RARE.map(k=>{const sp=SPECIES[k],un=S.unlocked.includes(k);return '<button type="button" class="fcard'+(S.species===k?" cur":"")+(un?"":" lock")+'" data-f="'+k+'"><span class="i">'+sp.ic+'</span><b>'+sp.s+'</b><small>'+(un?(S.species===k?"plantada":"liberada"):"nível "+sp.lvl+" ou 📺 "+(S.adk[k]||0)+"/3")+'</small></button>'}).join("")+'</div>',sh=>{$$("[data-f]",sh).forEach(b=>b.onclick=()=>flowerPage(b.dataset.f))})}
R.jardim=function(el){
  const p=phase||phaseNow(),sp=SPECIES[S.species];
  el.innerHTML='<div class="garden ph-'+p+'" id="garden"><div class="gstats"><div class="gs"><span>Nv '+S.level+'</span><div class="bar"><i style="width:'+S.xp+'%"></i></div></div><div class="gs"><span>❤️ '+S.vit+'%</span><div class="bar"><i style="width:'+S.vit+'%"></i></div></div></div>'+
   '<div class="phbtns" id="phb">'+[["dawn","🌅"],["day","☀️"],["dusk","🌇"],["night","🌙"]].map(a=>'<button data-p="'+a[0]+'" class="'+(a[0]===p?"on":"")+'" type="button" aria-label="'+a[0]+'">'+a[1]+'</button>').join("")+'</div>'+flowerHTML(S.species,p)+
   '<button class="bubble" id="bub" type="button" aria-label="Mensagem especial">💌</button><button class="bubble b2" id="bub2" type="button" aria-label="Ideia anônima">🤫</button>'+
   '<div class="bucket soil" id="bSoil" role="button" aria-label="Terra"><span>🪴</span><small>Terra · '+S.soil+'</small></div><div class="bucket water" id="bWater" role="button" aria-label="Água"><span>💧</span><small>Água · '+S.water+'</small></div></div>'+
   '<p class="xs mut" style="margin-top:8px;text-align:center">'+sp.ic+' '+esc(sp.n)+' · '+CAPS[p]+'<br>Arraste a terra e a água até a flor (ou toque).</p>'+
   '<div id="jx"></div><div class="card"><h3>Minhas flores</h3><p class="xs mut">Toque numa carta para abrir a página da flor.</p><div class="coll4">'+BASE.map(fcard).join("")+(RARE.includes(S.species)?fcard(S.species):'<button type="button" class="fcard" id="rareB"><span class="i">✨</span><b>Raras</b><small>··· '+RARE.length+' especiais</small></button>')+'</div>'+(RARE.includes(S.species)?'<button class="chip" id="rareB" type="button" style="margin-top:10px">✨ Ver as flores raras</button>':'')+'</div><div id="jx2"></div>';
  if(K.jardimExtra)K.jardimExtra(el);
  $$("#phb button",el).forEach(b=>b.onclick=()=>{phase=b.dataset.p;R.jardim(el)});
  $$("[data-f]",el).forEach(b=>b.onclick=()=>flowerPage(b.dataset.f));
  const rb=$("#rareB",el);if(rb)rb.onclick=rareSheet;
  $("#bub",el).onclick=()=>K.especial&&K.especial();
  $("#bub2",el).onclick=()=>K.secretSheet&&K.secretSheet();
  const g=$("#garden"),fw=$(".flowerwrap",el);
  let x0=null;fw.addEventListener("pointerdown",e=>{x0=e.clientX});fw.addEventListener("pointermove",e=>{if(x0!==null)fw.style.setProperty("--tilt",Math.max(-14,Math.min(14,(e.clientX-x0)*.25))+"deg")});
  const up=()=>{x0=null;fw.style.setProperty("--tilt","0deg")};fw.addEventListener("pointerup",up);fw.addEventListener("pointercancel",up);
  const rain=s=>{for(let i=0;i<7;i++){const d=document.createElement("span");d.className="drop";d.textContent=s;d.style.left=(35+Math.random()*30)+"%";d.style.top=(25+Math.random()*15)+"%";d.style.animationDelay=(i*70)+"ms";g.appendChild(d);setTimeout(()=>d.remove(),1400)}const sv=$("svg",fw);sv.classList.remove("bump");void sv.getBoundingClientRect();sv.classList.add("bump");try{navigator.vibrate&&navigator.vibrate(30)}catch(e){}};
  function nutrient(kind){
    if(kind==="water"){
      if(S.water<=0){openSheet('<h3>Acabou a água de hoje 💧</h3><p class="sm mut" style="margin-top:6px">Veja um anúncio rápido para ganhar +1 regada.</p><button class="btn block" id="ad" type="button">Ver anúncio</button>',sh=>{$("#ad",sh).onclick=()=>{closeSheet();adOverlay(()=>{S.water++;save();toast("+1 regada 💧");R.jardim(el)})}});return}
      S.water--;S.vit=Math.min(100,S.vit+10);rain("💧");toast("💧 Regado! +15 XP");missionDone("care");gain(15,10)}
    else{if(S.soil<=0){toast("Hoje já adubaram. Amanhã tem mais!");return}S.soil--;rain("🟤");toast("🪴 Terra nova! +20 XP");missionDone("care");gain(20,6)}}
  function draggable(b,kind){
    b.addEventListener("pointerdown",e=>{e.preventDefault();
      const gh=document.createElement("div");gh.className="dragghost";gh.textContent=kind==="water"?"💧":"🪴";document.body.appendChild(gh);
      const sx=e.clientX,sy=e.clientY;let moved=false;
      const inside=ev=>{const r=g.getBoundingClientRect();return ev.clientX>r.left&&ev.clientX<r.right&&ev.clientY>r.top&&ev.clientY<r.bottom-90};
      const mv=ev=>{gh.style.left=(ev.clientX-28)+"px";gh.style.top=(ev.clientY-28)+"px";if(Math.hypot(ev.clientX-sx,ev.clientY-sy)>8)moved=true;g.classList.toggle("drop-hot",moved&&inside(ev))};
      const end=ev=>{removeEventListener("pointermove",mv);removeEventListener("pointerup",end);removeEventListener("pointercancel",end);gh.remove();g.classList.remove("drop-hot");if(!moved||inside(ev))nutrient(kind);else toast("Solte em cima da flor")};
      mv(e);addEventListener("pointermove",mv);addEventListener("pointerup",end);addEventListener("pointercancel",end)})}
  draggable($("#bSoil",el),"soil");draggable($("#bWater",el),"water");
};

/* ---------- PERFIL ---------- */
let deferred=null;
addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferred=e;K.deferred=e});
R.perfil=function(el){
  el.innerHTML='<div class="card"><h3>Nós dois</h3>'+
   '<label class="lb">Como você prefere ser chamado(a)?</label><input class="field" id="nA" maxlength="18" value="'+esc(S.names.a)+'"><label class="lb">Como chama o seu amor?</label><input class="field" id="nB" maxlength="18" value="'+esc(S.names.b)+'">'+
   '<label class="lb">Eu sou</label><div class="chips"><button class="chip'+(S.role==="ela"?" on":"")+'" data-role="ela" type="button">👩 Ela (ciclo e dicas)</button><button class="chip'+(S.role==="ele"?" on":"")+'" data-role="ele" type="button">👨 Ele</button></div><div class="row" style="margin-top:12px"><button class="btn ghost" id="pA" type="button">📷 Minha foto</button><button class="btn ghost" id="pB" type="button">📷 Foto do amor</button></div>'+
   '<p class="xs mut" style="margin-top:6px">As fotos ficam salvas no seu celular, mesmo fechando o app.</p></div>'+
  '<div class="card"><h3>Fundo do app</h3><div class="chips" id="bgs">'+THEMES.map((t,i)=>{const un=S.level>=t.lvl;return '<button class="chip" type="button" data-b="'+i+'" title="'+t.n+'" style="width:auto;min-width:86px;height:56px;border-radius:12px;background:'+t.g+';font-size:11px;'+((S.bg.kind==="grad"&&S.bg.idx===i)?"outline:2px solid #fff;":"")+(un?"":"opacity:.5")+'">'+(un?t.n:"🔒 nível "+t.lvl)+'</button>'}).join("")+'</div>'+
   '<div class="row" style="margin-top:10px"><button class="btn ghost" id="pBg" type="button">🖼️ Usar uma foto</button>'+(IMG.bg?'<button class="btn ghost" id="rBg" type="button">Tirar foto</button>':'')+'</div></div>'+
  '<div id="pextra"></div>'+
  '<div class="card"><h3>Receber algo do amor</h3><p class="sm mut">Se recebeu um presente ou o ciclo por mensagem, cole o código aqui:</p><textarea class="field" id="code" rows="2" placeholder="Cole aqui o texto recebido"></textarea><button class="btn block" id="useCode" type="button">Usar código</button></div>'+
  '<div class="card"><h3>Sobre</h3><p class="sm">Kizuna '+VERSION+' by VŌLVA</p><div class="row" style="margin-top:8px"><button class="btn ghost" id="reset" type="button">Apagar meus dados</button></div></div>';
  if(K.perfilExtra)K.perfilExtra(el);
  const nm=()=>{S.names.a=$("#nA",el).value.trim()||"Você";S.names.b=$("#nB",el).value.trim()||"Amor";save();renderTop()};
  $("#nA",el).oninput=nm;$("#nB",el).oninput=nm;
  const pickImg=(key,max)=>{const i=document.createElement("input");i.type="file";i.accept="image/*";i.onchange=async()=>{const f=i.files[0];if(!f)return;try{const u=await compress(f,max,.82);IMG[key]=u;await IDB.set("p_"+key,u);if(key==="bg"){S.bg.kind="foto";save()}applyImages();toast("Foto salva ✓");R.perfil(el)}catch(e){toast("Não consegui abrir essa foto")}};i.click()};
  $$("[data-role]",el).forEach(b=>b.onclick=()=>{S.role=b.dataset.role;save();renderTop();R.perfil(el)});
  $("#pA",el).onclick=()=>pickImg("a",480);$("#pB",el).onclick=()=>pickImg("b",480);$("#pBg",el).onclick=()=>pickImg("bg",1000);
  const rb=$("#rBg",el);if(rb)rb.onclick=async()=>{IMG.bg=null;await IDB.del("p_bg");S.bg.kind="grad";save();applyImages();R.perfil(el)};
  $$("[data-b]",el).forEach(b=>b.onclick=()=>{if(S.level<THEMES[+b.dataset.b].lvl){toast("Libera no nível "+THEMES[+b.dataset.b].lvl);return}S.bg={kind:"grad",idx:+b.dataset.b};save();applyImages();R.perfil(el)});
  $("#useCode",el).onclick=()=>{const c=K.useCode($("#code",el).value);if(!c)toast("Não achei um código válido nesse texto")};
  $("#reset",el).onclick=()=>ask("Apagar tudo e começar do zero?","Sim, apagar",async()=>{localStorage.removeItem(KEY);for(const k of ["p_a","p_b","p_bg"])await IDB.del(k);location.reload()});
};

K.open=function(id){
  if(id==="roleta-slim"){go("roleta");return}if(id==="roleta-hot"){go("hot");return}
  if(["presentes","hot","ciclo","roleta","noite","jardim","perfil"].includes(id)){go(id);return}
  if(K.pages[id])K.pages[id]();
};
K.pages={};K.R=R;K.getCur=()=>cur;

/* ---------- inicio ---------- */
function boot(){
  rollover();
  go("jardim");loadImages();
  try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
  if(K.afterBoot)K.afterBoot();
  if("serviceWorker" in navigator&&location.protocol.startsWith("http"))addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
window.K.boot=boot;
})();
