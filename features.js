/* KIZUNA 2.0 - roletas, filme/serie, ciclo, presentes, album */
(function(){
"use strict";
const {$,$$,esc,toast,openSheet,closeSheet,openPage,fx,share,makeCode,parseCode,pick,compress,IDB,reduce,pad,iso}=K;
const S=K.S(),save=K.save,R=K.R;
const gain=(...a)=>K.gain(...a);
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};

/* =====================  ROLETAS (Slim e Hot)  ===================== */
/* A lista fica em roletas.js / roletas.json. Se tiver internet, o app pega a lista nova da semana sozinho. */
try{const c=JSON.parse(localStorage.getItem("kz_roletas")||"null");if(c&&c.semana>KZ_ROLETAS.semana&&c.slim&&c.hot)window.KZ_ROLETAS=c}catch(e){}
function onboard(){
  if(S.onboard){K.dailyFlow();return}
  let role="";
  openSheet('<h3>Bem-vindos ao Kizuna 2.0 💕</h3><p class="sm mut" style="margin-top:6px">Como vocês se chamam?</p><label class="lb">Como você prefere ser chamado(a)?</label><input class="field" id="o1" maxlength="18" placeholder="Seu nome"><label class="lb">Como chama o seu amor?</label><input class="field" id="o2" maxlength="18" placeholder="Nome do seu amor"><label class="lb">Eu sou</label><div class="chips"><button class="chip" data-r="ela" type="button">👩 Ela</button><button class="chip" data-r="ele" type="button">👨 Ele</button></div><button class="btn block" id="oo" type="button">Começar</button>',sh=>{
    $$("[data-r]",sh).forEach(b=>b.onclick=()=>{role=b.dataset.r;$$("[data-r]",sh).forEach(x=>x.classList.toggle("on",x===b))});
    $("#oo",sh).onclick=()=>{S.names.a=$("#o1",sh).value.trim()||"Você";S.names.b=$("#o2",sh).value.trim()||"Amor";S.role=role;S.onboard=1;save();closeSheet();K.render(K.getCur());setTimeout(K.dailyFlow,300)}});
}
K.afterBoot=function(){
  setTimeout(onboard,500);
  try{fetch(K.SITE+"roletas.json?"+Date.now(),{cache:"no-store"}).then(r=>r.ok?r.json():null).then(j=>{
    if(j&&j.semana>KZ_ROLETAS.semana&&Array.isArray(j.slim)&&Array.isArray(j.hot)&&j.slim.length>5&&j.hot.length>5){window.KZ_ROLETAS=j;try{localStorage.setItem("kz_roletas",JSON.stringify(j))}catch(e){}}}).catch(()=>{})}catch(e){}
  if(location.hash&&location.hash.indexOf("KZ1.")>=0){const h=decodeURIComponent(location.hash.slice(1));history.replaceState(null,"",location.pathname+location.search);K.useCode(h)}
};
const COLS={slim:["#d1457f","#8e3ec0","#e0788f","#5a4bd1"],hot:["#c2185b","#7a0f2e","#e0394a","#5b1a6e"],dec:["#2a9fd6","#8e3ec0","#e0788f","#2f8a5b"]};
const NO={fmt:"serie",a:new Set(["romance"]),b:new Set(["acao"]),out:[]};
let rotNow=0,spinning=false,nTasks=1,rmode="tarefas";
function drawWheel(cv,list,md){
  const N=list.length,sz=640,ctx=cv.getContext("2d");cv.width=cv.height=sz;const r=sz/2,seg=Math.PI*2/N,fs=N>16?34:46;
  for(let i=0;i<N;i++){const a0=-Math.PI/2+i*seg;ctx.beginPath();ctx.moveTo(r,r);ctx.arc(r,r,r-4,a0,a0+seg);ctx.closePath();ctx.fillStyle=COLS[md][i%COLS[md].length];ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,.35)";ctx.lineWidth=1.5;ctx.stroke();
    ctx.save();ctx.translate(r,r);ctx.rotate(a0+seg/2);ctx.font=fs+"px 'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.translate(r*.78,0);ctx.rotate(Math.PI/2);ctx.fillText(list[i].e,0,0);ctx.restore()}
}
const DEC_FILME=[["💕","Romance","romance"],["😂","Comédia","comedia"],["💥","Ação","acao"],["🕵️","Suspense","suspense"],["👻","Terror","terror"],["🧙","Fantasia","fantasia"],["🚀","Ficção","ficcao"],["😢","Drama","drama"],["🔪","Crime","crime"],["🗺️","Aventura","aventura"],["🍳","Culinária","culinaria"],["🎲","Surpresa",""]].map(a=>({e:a[0],t:a[1],g:a[2]}));
const DEC_COMIDA=[["🍕","Pizza"],["🍔","Hambúrguer"],["🍣","Japonês"],["🍝","Massa"],["🥩","Churrasco"],["🌮","Mexicano"],["🍦","Sorvete ou açaí"],["🥟","Pastel"],["🍛","Strogonoff"],["🥗","Algo leve e saudável"],["🍫","Só sobremesa"],["👩‍🍳","Cozinhar em casa"]].map(a=>({e:a[0],t:a[1]}));
/* roleta generica: serve para a Roleta do casal e para a Roleta Hot */
K.wheelUI=function(el,cfg){
  const list=cfg.list,hot=!!cfg.hot,dec=!!cfg.decide,key=cfg.key,md=cfg.colors||(hot?"hot":"slim");
  S.roleta.hist[key]=S.roleta.hist[key]||[];
  el.innerHTML=(dec?'':'<div class="chips" style="justify-content:center"><button class="chip'+(nTasks===1?" on":"")+'" data-n="1" type="button">1 tarefa</button><button class="chip'+(nTasks===2?" on":"")+'" data-n="2" type="button">2 tarefas (1 para cada)</button></div>')+
   '<div class="wheelbox"><div class="ptr"></div><canvas id="wh"></canvas><button class="hub" id="hub" type="button" aria-label="Girar">🎯</button></div>'+
   '<button class="btn block'+(hot?" hot":"")+'" id="spin" type="button">Girar a roleta</button><div id="res"></div>'+
   (dec?'':'<div class="card"><div class="row sp"><h3>Tarefas desta semana</h3><span class="pill">'+list.length+'</span></div><p class="xs mut">Lista '+esc(KZ_ROLETAS.semana)+' · atualizada em '+esc(KZ_ROLETAS.atualizadoEm)+'. Troca a cada 7 dias.</p><button class="chip" id="seeL" type="button" style="margin-top:8px">Ver a lista inteira</button><div id="lst"></div></div>');
  $$("[data-n]",el).forEach(b=>b.onclick=()=>{nTasks=+b.dataset.n;K.wheelUI(el,cfg)});
  const sl=$("#seeL",el);if(sl)sl.onclick=()=>{$("#lst",el).innerHTML='<div class="lista">'+list.map(t=>'<div>'+t.e+' '+esc(t.t)+(t.j?' <span class="xs mut">(a dois)</span>':'')+'</div>').join("")+'</div>';sl.remove()};
  const cv=$("#wh",el);drawWheel(cv,list,md);cv.style.transform="rotate("+rotNow+"deg)";
  const seg=360/list.length;
  function spinTo(idx){return new Promise(res=>{const target=360-(idx*seg+seg/2);rotNow+=360*5+((target-(rotNow%360))+360)%360;cv.style.transform="rotate("+rotNow+"deg)";setTimeout(res,reduce?60:4300)})}
  function nextIdx(avoid){const h=S.roleta.hist[key];let i,t=0;do{i=rnd(list.length);t++}while((h.includes(i)||avoid===i)&&t<80);h.push(i);if(h.length>Math.min(8,list.length-2))h.shift();return i}
  async function go(){
    if(spinning)return;spinning=true;const res=$("#res",el);res.innerHTML="";
    try{
      const a=nextIdx(),first=list[a];await spinTo(a);
      if(dec||nTasks===1)showOne(res,first);
      else{toast("Agora a segunda tarefa…");await new Promise(r=>setTimeout(r,700));const b=nextIdx(a),second=list[b];await spinTo(b);showTwo(res,first,second)}
    }finally{spinning=false}
  }
  $("#spin",el).onclick=go;$("#hub",el).onclick=go;
  const head=hot?" hot":"";
  function showOne(res,t){
    if(dec){res.innerHTML='<div class="result"><div class="e">'+t.e+'</div><p class="t">Hoje vai de: '+esc(t.t)+'!</p>'+(t.g!==undefined?'<button class="btn block" id="tt" type="button">Sortear um título de '+esc(t.t)+'</button>':'')+'<button class="btn ghost block" id="again" type="button">Girar de novo</button></div>';
      const tt=$("#tt",res);if(tt)tt.onclick=()=>{NO.a=new Set(t.g?[t.g]:[]);NO.b=new Set();NO.out=[];K.go("noite")};
      $("#again",res).onclick=()=>{res.innerHTML="";go()};fx(t.e,8);return}
    const jas=["golden_jasmine","imperial_lily","midnight_lotus"].includes(S.species);
    res.innerHTML='<div class="result'+head+'"><div class="e">'+t.e+'</div><p class="t">'+esc(t.t)+'</p>'+(jas?'<div class="boss"><b>🎁 Giro surpresa ('+esc(K.SPECIES[S.species].s)+'):</b> '+esc(pick(PRIZES))+'</div>':'')+(t.j?'<div class="boss" id="boss"><b>👑 Tarefa a dois.</b> Sorteando quem comanda…</div>':'')+'<button class="btn block'+(hot?" hot":"")+'" id="okT" type="button">✅ Cumprimos! (+10 XP)</button><button class="btn ghost block" id="skipT" type="button">Hoje não, girar de novo</button></div>';
    if(t.j)sortBoss($("#boss",res));
    $("#okT",res).onclick=()=>done(res);$("#skipT",res).onclick=()=>{res.innerHTML="";go()};
  }
  function showTwo(res,t1,t2){
    const A=S.names.a,B=S.names.b,flip=rnd(2)===0,o1=flip?A:B,o2=flip?B:A;
    const line=(t,o)=>'<div class="boss"><b>'+esc(o)+'</b> · '+t.e+' '+esc(t.t)+(t.j?' <span class="xs mut">(a dois, comanda '+esc(o)+')</span>':'')+'</div>';
    res.innerHTML='<div class="result'+head+'"><b>As duas tarefas foram sorteadas!</b>'+line(t1,o1)+line(t2,o2)+'<button class="btn block'+(hot?" hot":"")+'" id="okT" type="button">✅ Cumprimos as duas! (+20 XP)</button></div>';
    $("#okT",res).onclick=()=>done(res,2);
  }
  function sortBoss(box){
    const names=[S.names.a,S.names.b];let n=0;const iv=setInterval(()=>{box.innerHTML="<b>👑 Quem comanda?</b> "+esc(names[n++%2])+" …"},140);
    setTimeout(()=>{clearInterval(iv);const w=rnd(2);box.innerHTML='<b>👑 Hoje comanda:</b> '+esc(names[w])+'<br><span class="sm">'+esc(names[1-w])+' aproveita e segue as ordens com carinho 😉</span>';fx("👑",6)},1600)}
  function done(res,n){n=n||1;S.roleta.feitas+=n;save();K.missionDone("spin");res.innerHTML='<div class="result"><div class="e">🎉</div><p class="t">Que lindo! Missão cumprida.</p></div>';fx(hot?["🔥","💋","❤️"]:["💖","✨"],14);gain(10*n,4)}
};
R.roleta=function(el){
  const RL=KZ_ROLETAS;
  el.innerHTML='<h2 style="margin:12px 2px 0;font-size:22px">Roleta do casal 🎡</h2><div class="chips" style="margin-bottom:4px">'+[["tarefas","🎯 Tarefas"],["filme","🎬 Que filme?"],["comida","🍕 Que comida?"],["quem","👑 Quem escolhe?"]].map(a=>'<button class="chip'+(rmode===a[0]?" on":"")+'" data-rm="'+a[0]+'" type="button">'+a[1]+'</button>').join("")+'</div><div id="wv"></div>';
  $$("[data-rm]",el).forEach(b=>b.onclick=()=>{rmode=b.dataset.rm;R.roleta(el)});
  const box=$("#wv",el);
  if(rmode==="tarefas")K.wheelUI(box,{list:RL.slim,key:"slim"});
  else if(rmode==="filme")K.wheelUI(box,{list:DEC_FILME,key:"dfilme",decide:1,colors:"dec"});
  else if(rmode==="comida")K.wheelUI(box,{list:DEC_COMIDA,key:"dcomida",decide:1,colors:"dec"});
  else{const l=[];for(let i=0;i<10;i++)l.push({e:i%2?"💗":"💙",t:i%2?S.names.b:S.names.a});K.wheelUI(box,{list:l,key:"dquem",decide:1,colors:"dec"})}
};

/* =====================  NOITE: filme / serie / anime  ===================== */

function sortear(){
  const all=KZ_MEDIA[NO.fmt],seen=S.seen[NO.fmt];
  const sc=all.map(m=>{const a=m.g.filter(x=>NO.a.has(x)).length,b=m.g.filter(x=>NO.b.has(x)).length;return {m,a,b,s:(a>0?10:0)+(b>0?10:0)+Math.min(a+b,4),r:Math.random()}});
  const any=NO.a.size||NO.b.size;
  let pool=any?sc.filter(x=>x.s>0):sc;
  pool.sort((x,y)=>y.s-x.s||x.r-y.r);
  let fresh=pool.filter(x=>!seen.includes(x.m.t));
  if(fresh.length<3){S.seen[NO.fmt]=[];fresh=pool}
  const top=fresh.slice(0,3);top.forEach(x=>S.seen[NO.fmt].push(x.m.t));if(S.seen[NO.fmt].length>60)S.seen[NO.fmt].splice(0,20);save();
  NO.out=top.map(x=>({t:x.m.t,g:x.m.g,pct:any?Math.min(99,52+(x.a>0?20:0)+(x.b>0?20:0)+Math.min(x.a+x.b,3)*2):70}));
}
const STREAMS=[["netflix","Netflix","https://www.netflix.com/search?q="],["prime","Prime Video","https://www.primevideo.com/search/ref=atv_nb_sug?phrase="],["disney","Disney+","https://www.disneyplus.com/search/"],["max","Max","https://play.max.com/search?q="],["globoplay","Globoplay","https://globoplay.globo.com/busca/?q="],["apple","Apple TV+","https://tv.apple.com/search?term="],["paramount","Paramount+","https://www.paramountplus.com/search/?q="],["crunchy","Crunchyroll","https://www.crunchyroll.com/search?q="],["youtube","YouTube","https://www.youtube.com/results?search_query="]];
function ondeLinks(t){const my=STREAMS.filter(x=>S.streams.includes(x[0]));if(!my.length)return '<a class="chip" target="_blank" rel="noopener" href="https://www.google.com/search?q='+encodeURIComponent(t+" onde assistir")+'">Onde assistir ›</a>';return my.map(x=>'<a class="chip" target="_blank" rel="noopener" href="'+x[2]+encodeURIComponent(t)+'">▶ '+x[1]+'</a>').join(" ")}
R.noite=function(el){
  if(!NO.out.length)sortear();
  const gl=Object.fromEntries(KZ_GENEROS);
  const chips=who=>KZ_GENEROS.map(([k,l])=>'<button type="button" class="chip'+(NO[who].has(k)?" on":"")+'" data-w="'+who+'" data-k="'+k+'">'+l+'</button>').join("");
  el.innerHTML='<div class="card"><h3>O que vão assistir hoje?</h3><p class="sm mut" style="margin-top:4px">Cada um marca o que quer. Sempre que mudar, saem títulos novos.</p>'+
   '<div class="seg" style="margin-top:10px;grid-template-columns:repeat(3,1fr)">'+[["serie","📺 Série"],["filme","🎞️ Filme"],["anime","🍥 Anime"]].map(a=>'<button type="button" data-f="'+a[0]+'" class="'+(NO.fmt===a[0]?"on":"")+'">'+a[1]+'</button>').join("")+'</div>'+
   '<p class="sm" style="margin-top:12px"><b>'+esc(S.names.a)+'</b> quer</p><div class="chips">'+chips("a")+'</div><p class="sm" style="margin-top:12px"><b>'+esc(S.names.b)+'</b> quer</p><div class="chips">'+chips("b")+'</div>'+
   '<button class="btn block" id="sort" type="button">🎲 Sortear outras opções</button></div>'+
   '<div class="card"><b class="sm">Seus streamings</b><p class="xs mut">Marque os que vocês têm. Os botões abaixo abrem a busca direto neles.</p><div class="chips">'+STREAMS.map(x=>'<button class="chip'+(S.streams.includes(x[0])?" on":"")+'" data-st="'+x[0]+'" type="button">'+x[1]+'</button>').join("")+'</div></div>'+
   '<div id="out">'+NO.out.map(o=>'<div class="pick"><div class="row sp"><b>'+esc(o.t)+'</b><span class="pill">'+o.pct+'%</span></div><div class="xs mut" style="margin:3px 0 8px">'+o.g.map(x=>gl[x]).join(" · ")+'</div><div class="chips" style="margin:0">'+ondeLinks(o.t)+'</div></div>').join("")+'</div>'+
   '<div class="card"><h3>Antes do play 🍿</h3><p class="sm">Façam pipoca, apaguem a luz e deixem o celular longe. Depois, que tal girar a roleta?</p><button class="btn ghost block" id="toR" type="button">Ir para as roletas</button></div>';
  $$("[data-f]",el).forEach(b=>b.onclick=()=>{NO.fmt=b.dataset.f;sortear();R.noite(el)});
  $$("[data-w]",el).forEach(b=>b.onclick=()=>{const s=NO[b.dataset.w],k=b.dataset.k;s.has(k)?s.delete(k):s.add(k);sortear();R.noite(el)});
  $$("[data-st]",el).forEach(b=>b.onclick=()=>{const k=b.dataset.st,i=S.streams.indexOf(k);i<0?S.streams.push(k):S.streams.splice(i,1);save();R.noite(el)});
  $("#sort",el).onclick=()=>{sortear();R.noite(el);fx("🎬",4)};
  $("#toR",el).onclick=()=>K.go("roleta");
};

/* =====================  CICLO  ===================== */
KZ_FASES.fertil.cor="#1e88c9";
const dd=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d,12)};
const diffDays=(a,b)=>Math.round((a-b)/864e5);
const brDate=d=>pad(d.getDate())+"/"+pad(d.getMonth()+1);
function faseDe(d,len,per){const ov=len-14;if(d<=per)return"menstrual";if(d<ov-1)return"folicular";if(d<=ov+1)return"fertil";if(d<=len-5)return"lutea";return"tpm"}
function info(c,date){
  if(!c||!c.starts||!c.starts.length)return null;date=date||new Date();date=new Date(date.getFullYear(),date.getMonth(),date.getDate(),12);
  const len=c.len||28,per=Math.min(c.per||5,len-8);const st=c.starts.slice().sort();let last=null;
  for(const s of st){if(dd(s)<=date)last=dd(s)}
  if(!last)return null;
  let n=diffDays(date,last);const ciclos=Math.floor(n/len);const day=n%len+1;
  const cicloStart=new Date(last.getTime()+ciclos*len*864e5);const next=new Date(cicloStart.getTime()+len*864e5);
  return {day,len,per,fase:faseDe(day,len,per),next,old:ciclos>=2,projected:ciclos>=1}
}
function tipsFor(inf){
  const F=KZ_FASES[inf.fase],dia=(F.dias&&F.dias[inf.day])||[];const g=F.geral;const start=window.K.dnum();
  const extra=[g[start%g.length],g[(start+1)%g.length]].filter(x=>!dia.includes(x));
  return dia.concat(extra).slice(0,3)}
window.KZ_cicloHoje=function(){
  const c=S.ciclo||S.parceiro;const inf=info(c);if(!inf)return null;const F=KZ_FASES[inf.fase];
  return {ic:F.ic,titulo:"Dia "+inf.day+" do ciclo de "+(c.n||"ela")+" · "+F.n,dica:tipsFor(inf)[0]}
};
/* importar: aceita CSV, JSON, ICS ou texto com datas */
function extractDates(txt){
  const out=new Set(),ok=(y,m,d)=>y>=2015&&y<=2100&&m>=1&&m<=12&&d>=1&&d<=31&&new Date(y,m-1,d).getMonth()===m-1;
  const add=(y,m,d)=>{if(ok(y,m,d))out.add(y+"-"+pad(m)+"-"+pad(d))};
  let t=String(txt).replace(/(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/g,(_,y,m,d)=>{add(+y,+m,+d);return" "});
  t=t.replace(/(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4}|\d{2})(?!\d)/g,(_,a,b,y)=>{y=+y;if(y<100)y+=2000;a=+a;b=+b;if(b>12&&a<=12)add(y,a,b);else add(y,b,a);return" "});
  t.replace(/(?<!\d)(20\d{2})(\d{2})(\d{2})(?!\d)/g,(_,y,m,d)=>{add(+y,+m,+d);return" "});
  return [...out].sort()}
function detectStarts(dates){
  const lim=new Date();lim.setDate(lim.getDate()+1);const ds=dates.filter(s=>dd(s)<=lim);const cl=[];
  ds.forEach(s=>{const c=cl[cl.length-1];if(c&&diffDays(dd(s),dd(c[c.length-1]))<=6)c.push(s);else cl.push([s])});
  const starts=cl.map(c=>c[0]);const diffs=[];for(let i=1;i<starts.length;i++){const d=diffDays(dd(starts[i]),dd(starts[i-1]));if(d>=18&&d<=50)diffs.push(d)}
  const med=a=>{a=a.slice().sort((x,y)=>x-y);return a.length?a[Math.floor(a.length/2)]:0};
  const per=med(cl.filter(c=>c.length>1).map(c=>c.length).filter(n=>n>=2&&n<=10));
  return {starts:starts.slice(-12),len:med(diffs)||0,per:per||0}}
const COR=f=>KZ_FASES[f].cor;
const MESES=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
let calYM=null;
function drawMonth(b,c,mine){
  const now=new Date();if(!calYM)calYM={y:now.getFullYear(),m:now.getMonth()};
  const {y,m}=calYM,first=new Date(y,m,1,12),lead=first.getDay(),n=new Date(y,m+1,0).getDate(),starts=(c.starts||[]);
  let h='<div class="row sp"><button class="chip" data-mv="-1" type="button">‹</button><b>'+MESES[m]+' '+y+'</b><button class="chip" data-mv="1" type="button">›</button></div><div class="cal wd">'+["D","S","T","Q","Q","S","S"].map(x=>"<div>"+x+"</div>").join("")+'</div><div class="cal">';
  for(let i=0;i<lead;i++)h+='<div style="background:none"></div>';
  const todayS=iso(now);
  for(let d=1;d<=n;d++){const dt=new Date(y,m,d,12),ds=iso(dt),x=info(c,dt);
    h+='<div data-d="'+ds+'" class="'+(ds===todayS?"today ":"")+(starts.includes(ds)?"pstart ":"")+(x&&(x.projected||dt>now)?"proj":"")+'" style="'+(x?"background:"+COR(x.fase):"")+'">'+d+'</div>'}
  h+='</div>';
  const mc=$("#mc",b);mc.innerHTML=h;
  $$("[data-mv]",mc).forEach(bt=>bt.onclick=()=>{let nm=calYM.m+ +bt.dataset.mv,ny=calYM.y;if(nm<0){nm=11;ny--}if(nm>11){nm=0;ny++}calYM={y:ny,m:nm};drawMonth(b,c,mine)});
  $$("[data-d]",mc).forEach(el=>el.onclick=()=>{const ds=el.dataset.d,x=info(c,dd(ds));const F=x&&KZ_FASES[x.fase];const isStart=starts.includes(ds),fut=dd(ds)>new Date();
    openSheet('<h3>'+brDate(dd(ds))+'/'+dd(ds).getFullYear()+'</h3>'+(x?'<p style="margin-top:6px"><span class="phasebadge" style="background:'+F.cor+'">'+F.ic+" "+F.n+'</span> <span class="sm mut">dia '+x.day+' do ciclo'+(x.projected?" (previsão)":"")+'</span></p><p class="sm" style="margin-top:8px">'+esc(F.sente)+'</p>':'<p class="sm mut" style="margin-top:6px">Sem dados para este dia.</p>')+
      (mine&&!fut&&!isStart?'<button class="btn block" id="ms" type="button">🩸 A menstruação começou neste dia</button>':'')+(mine&&isStart?'<button class="btn ghost block" id="rs" type="button">Remover este início</button>':''),sh=>{
      const ms=$("#ms",sh);if(ms)ms.onclick=()=>{const st=(S.ciclo&&S.ciclo.starts||[]).filter(z=>z!==ds);st.push(ds);S.ciclo=Object.assign({n:S.names.a,len:28,per:5},S.ciclo,{starts:st.sort().slice(-12)});save();closeSheet();toast("Anotado! Calendário atualizado");K.pages.ciclo()};
      const rs=$("#rs",sh);if(rs)rs.onclick=()=>{S.ciclo.starts=S.ciclo.starts.filter(z=>z!==ds);save();closeSheet();K.pages.ciclo()}})})}
function drawRanges(b,c,inf){
  const start=new Date();start.setHours(12);start.setDate(start.getDate()-(inf.day-1));const out=[];let cur=null;
  for(let d=1;d<=inf.len;d++){const f=faseDe(d,inf.len,inf.per);if(!cur||cur.f!==f){cur={f,a:d,b:d};out.push(cur)}else cur.b=d}
  const at=n=>{const t=new Date(start);t.setDate(t.getDate()+n-1);return brDate(t)};
  $("#rg",b).innerHTML=out.map(r=>'<div class="rng"><span><i style="background:'+COR(r.f)+'"></i>'+KZ_FASES[r.f].ic+" "+KZ_FASES[r.f].n+'</span><b>'+(r.a===r.b?at(r.a):at(r.a)+" a "+at(r.b))+'</b></div>').join("")}
K.pages.ciclo=function(){
  let tab=(S.ciclo||S.parceiro)?"dicas":"cad";let draft=null;
  openPage("Ciclo e dicas 🌙",'<div id="cy"></div>',pb=>{draw();
    function draw(){
      const c=S.ciclo||S.parceiro,inf=info(c);const box=$("#cy",pb);
      box.innerHTML='<div class="seg" style="margin-top:8px"><button type="button" data-t="dicas" class="'+(tab==="dicas"?"on":"")+'">Dicas para o parceiro</button><button type="button" data-t="cad" class="'+(tab==="cad"?"on":"")+'">Cadastrar ciclo</button></div><div id="cb"></div>';
      $$("[data-t]",box).forEach(b=>b.onclick=()=>{tab=b.dataset.t;draw()});
      tab==="dicas"?dicas($("#cb",box),c,inf):cad($("#cb",box),c)}
    function dicas(b,c,inf){
      if(!inf){b.innerHTML='<div class="card"><h3>Ainda não tem ciclo</h3><p class="sm mut" style="margin-top:6px">Ela cadastra as datas (ou importa de outro app) na aba “Cadastrar ciclo”. Se o ciclo foi enviado pelo parceiro, cole o código em Perfil.</p><button class="btn block" id="go" type="button">Cadastrar agora</button></div>';$("#go",b).onclick=()=>{tab="cad";draw()};return}
      const F=KZ_FASES[inf.fase],tips=tipsFor(inf),mine=!!S.ciclo;
      b.innerHTML='<div class="card"><div class="row sp"><span class="phasebadge" style="background:'+F.cor+'">'+F.ic+" "+F.n+'</span><span class="sm mut">Dia '+inf.day+' de '+inf.len+'</span></div><p class="sm" style="margin-top:10px"><b>Ciclo de '+esc(c.n||"ela")+'</b>'+(mine?"":" (recebido do parceiro)")+'</p><p class="sm mut" style="margin-top:4px">'+esc(F.sente)+'</p>'+(inf.old?'<p class="sm err" style="margin-top:8px">As datas estão antigas. Toque no primeiro dia da última menstruação no calendário para atualizar.</p>':'')+'</div>'+
        '<h3 style="margin:16px 2px 0">Dicas para hoje</h3>'+tips.map((t,i)=>'<div class="card"><div class="tipbox"><b>'+(i===0?"⭐ ":"")+esc(t.t)+'</b><span class="sm">'+esc(t.b)+'</span></div></div>').join("")+
        '<div class="card"><h3>Calendário</h3><div id="mc"></div><div class="legend">'+Object.keys(KZ_FASES).map(k=>'<span><i style="background:'+COR(k)+'"></i>'+KZ_FASES[k].n+'</span>').join("")+'</div><p class="xs mut" style="margin-top:6px">Toque num dia para ver a fase'+(mine?" ou marcar o início da menstruação":"")+'. Dias mais claros são previsões.</p></div>'+
        '<div class="card"><h3>Este ciclo, dia a dia</h3><div id="rg"></div><p class="sm" style="margin-top:10px">Próxima menstruação por volta de <b>'+brDate(inf.next)+'</b>.</p><p class="xs mut" style="margin-top:6px">Estimativa baseada nas datas informadas. Não substitui orientação médica e não é método contraceptivo.</p></div>'+
        (mine?'<button class="btn block" id="env" type="button">Enviar dica de hoje ao parceiro</button>':'');
      drawMonth(b,c,mine);drawRanges(b,c,inf);
      const env=$("#env",b);if(env)env.onclick=()=>{const t=tips[0];share("💕 Hoje é o dia "+inf.day+" do ciclo de "+(c.n||S.names.a)+" ("+F.n+").\n"+t.t+": "+t.b,makeCode({t:"c",n:c.n||S.names.a,s:c.starts.slice(-6),l:c.len,p:c.per}))}}
    function cad(b,c){
      const cc=S.ciclo||{n:S.names.a,starts:[],len:28,per:5};
      b.innerHTML='<div class="card"><h3>Digitar as datas</h3><label class="lb">Nome dela</label><input class="field" id="cn" maxlength="18" value="'+esc(cc.n||S.names.a)+'">'+
       '<label class="lb">Primeiro dia da última menstruação</label><input class="field" id="cd" type="date" max="'+iso(new Date())+'" value="'+(cc.starts.length?cc.starts[cc.starts.length-1]:"")+'">'+
       '<div class="row"><div style="flex:1"><label class="lb">Duração do ciclo (dias)</label><input class="field" id="cl" type="number" min="20" max="45" value="'+(cc.len||28)+'"></div><div style="flex:1"><label class="lb">Dias de menstruação</label><input class="field" id="cp" type="number" min="2" max="10" value="'+(cc.per||5)+'"></div></div>'+
       '<button class="btn block" id="sv" type="button">Salvar ciclo</button><button class="btn ghost block" id="hoje" type="button">Minha menstruação começou hoje</button></div>'+
       '<div class="card"><h3>Importar de outro app</h3><p class="sm mut" style="margin-top:4px">Exporte do seu app (Flo, Clue, Natural Cycles, Meu Calendário…) um arquivo CSV, JSON ou texto e escolha aqui. Ou cole as datas.</p>'+
       '<button class="btn ghost block" id="fl" type="button">📂 Escolher arquivo</button><textarea class="field" id="tx" rows="3" placeholder="Ou cole aqui as datas. Ex.: 03/10/2026, 31/10/2026, 28/11/2026"></textarea><button class="btn block" id="imp" type="button">Ler datas</button><div id="dr"></div></div>'+
       (S.ciclo?'<button class="btn ghost block" id="rm" type="button">Apagar meu ciclo</button>':'');
      const read=txt=>{const ds=extractDates(txt);if(!ds.length){$("#dr",b).innerHTML='<p class="sm err" style="margin-top:8px">Não achei datas nesse conteúdo.</p>';return}
        draft=detectStarts(ds);const dr=$("#dr",b);dr.innerHTML='<p class="sm" style="margin-top:10px"><b>Achei '+draft.starts.length+' ciclo(s):</b></p><div class="chips">'+draft.starts.map(s=>'<span class="chip">'+brDate(dd(s))+"/"+dd(s).getFullYear()+'</span>').join("")+'</div><p class="sm mut" style="margin-top:6px">Duração média: '+(draft.len||28)+' dias'+(draft.per?" · menstruação: "+draft.per+" dias":"")+'</p><button class="btn block" id="use" type="button">Usar estas datas</button>';
        $("#use",b).onclick=()=>{S.ciclo={n:$("#cn",b).value.trim()||S.names.a,starts:draft.starts,len:draft.len||+$("#cl",b).value||28,per:draft.per||+$("#cp",b).value||5};save();toast("Ciclo importado ✓");tab="dicas";draw()}};
      $("#imp",b).onclick=()=>read($("#tx",b).value);
      $("#fl",b).onclick=()=>{const i=document.createElement("input");i.type="file";i.accept=".csv,.txt,.json,.ics,.tsv,text/*,application/json";i.onchange=()=>{const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>read(String(r.result));r.readAsText(f)};i.click()};
      $("#sv",b).onclick=()=>{const d=$("#cd",b).value;if(!d){toast("Escolha a data da última menstruação");return}
        const old=(S.ciclo&&S.ciclo.starts)||[];const st=old.filter(x=>x!==d);st.push(d);st.sort();
        S.ciclo={n:$("#cn",b).value.trim()||S.names.a,starts:st.slice(-12),len:Math.max(20,Math.min(45,+$("#cl",b).value||28)),per:Math.max(2,Math.min(10,+$("#cp",b).value||5))};save();toast("Ciclo salvo ✓");tab="dicas";draw()};
      $("#hoje",b).onclick=()=>{const nm=$("#cn",b).value.trim()||S.names.a;const st=((S.ciclo&&S.ciclo.starts)||[]).filter(x=>x!==iso(new Date()));st.push(iso(new Date()));S.ciclo=Object.assign({n:S.names.a,len:28,per:5},S.ciclo,{n:nm,starts:st.sort().slice(-12)});save();toast("Anotado! Dia 1 começou 🩸");tab="dicas";draw()};
      const rm=$("#rm",b);if(rm)rm.onclick=()=>K.ask("Apagar o ciclo cadastrado?","Apagar",()=>{S.ciclo=null;save();K.pages.ciclo()})}
  })};

/* =====================  PRESENTES  ===================== */
const GIFTS=[
 {k:"coracao",ic:"❤️",n:"Coração",fx:["❤️","💗","💖","💕"],dir:"up",msg:"Um coração só para você"},
 {k:"rosa",ic:"🌹",n:"Rosa",fx:["🌹","🌸","🥀"],dir:"down",msg:"Uma rosa para você"},
 {k:"buque",ic:"💐",n:"Buquê",fx:["💐","🌷","🌼"],dir:"down",msg:"Um buquê de carinho"},
 {k:"urso",ic:"🧸",n:"Ursinho",fx:["🧸","💛","🤍"],dir:"up",msg:"Um abraço de ursinho"},
 {k:"estrelas",ic:"✨",n:"Estrelas",fx:["✨","⭐","🌟"],dir:"down",msg:"Estrelas para a sua noite"},
 {k:"carta",ic:"💌",n:"Carta",fx:["💌","💞","💘"],dir:"up",msg:"Uma carta de amor"},
 {k:"chocolate",ic:"🍫",n:"Chocolate",fx:["🍫","🍓","🍬"],dir:"down",msg:"Uma doçura para você"},
 {k:"beijo",ic:"😘",n:"Beijo",fx:["😘","💋","💞"],dir:"up",msg:"Um beijo bem estalado"}
];
const gOf=k=>GIFTS.find(g=>g.k===k)||GIFTS[0];
function playGift(g,after){
  const G=gOf(g.k),ov=document.createElement("div");ov.className="fxcard";
  ov.innerHTML='<div class="big">'+G.ic+'</div><h2 style="font-family:Georgia,serif">'+esc(G.msg)+'</h2>'+(g.m?'<p style="font-size:18px">“'+esc(g.m)+'”</p>':'')+'<p class="sm mut">de '+esc(g.f||"alguém que te ama")+'</p><button class="btn" id="gx" type="button">Fechar</button>';
  $("#app").appendChild(ov);fx(G.fx,26,{dir:G.dir});const iv=setInterval(()=>fx(G.fx,10,{dir:G.dir}),1400);
  $("#gx",ov).onclick=()=>{clearInterval(iv);ov.remove();if(after)after()}}
K.pages.presentes=function(){
  let sel="coracao";
  openPage("Presentes 🎁",'<div id="pg"></div>',pb=>{draw();
   function draw(){
    const gf=S.gift,left=5-gf.ads;
    const cnt={};gf.recv.forEach(g=>cnt[g.k]=(cnt[g.k]||0)+1);const got=Object.keys(cnt).length;
    gf.recv.forEach(g=>g.visto=true);save();
    $("#pg",pb).innerHTML='<div class="card"><div class="row sp"><div><h3>Enviar um presente</h3><span class="sm mut">Você tem <b>'+gf.credits+'</b> presente(s) para enviar</span></div><button class="btn ghost" id="ad" type="button"'+(left<=0?" disabled":"")+'>▶ Ver anúncio<br><small>+1 presente</small></button></div>'+
      '<div class="gifts">'+GIFTS.map(g=>'<button type="button" data-g="'+g.k+'" class="'+(sel===g.k?"on":"")+'">'+g.ic+'<small>'+g.n+'</small></button>').join("")+'</div>'+
      '<input class="field" id="gm" maxlength="80" placeholder="Escreva uma mensagem (opcional)"><button class="btn block" id="send" type="button">Enviar presente</button><p class="xs mut" style="margin-top:6px">1 presente grátis por dia. Veja anúncios (até 5 por dia) para ganhar mais.</p></div>'+
      '<div class="card"><div class="row sp"><h3>Minha coleção</h3><span class="pill">'+got+'/'+GIFTS.length+'</span></div><p class="xs mut">Presentes que você recebeu. Colecione todos!</p><div class="gifts">'+GIFTS.map(g=>'<button type="button" data-c="'+g.k+'" style="'+(cnt[g.k]?"":"opacity:.35;filter:grayscale(1)")+'">'+g.ic+'<small>'+g.n+'</small><span class="n">'+(cnt[g.k]?"x"+cnt[g.k]:"")+'</span></button>').join("")+'</div>'+
      (gf.recv.length?'<div class="hr"></div>'+gf.recv.slice(-5).reverse().map(g=>'<div class="sm" style="padding:4px 0">'+gOf(g.k).ic+' de <b>'+esc(g.f||"alguém")+'</b>'+(g.m?': “'+esc(g.m)+'”':'')+'</div>').join(""):'<p class="sm mut" style="margin-top:8px">Nenhum presente recebido ainda. Peça para o seu amor te enviar um 😉</p>')+'</div>'+
      '<button class="card" id="alb" type="button" style="width:100%;text-align:left;display:block"><b>📸 Álbum Polaroid</b><div class="xs mut" style="margin-top:3px">'+S.album.length+' foto(s) · guardem as lembranças de vocês ›</div></button><div class="card"><p class="sm"><b>Como o parceiro recebe?</b> Depois de enviar, o app abre o compartilhamento (WhatsApp etc.). Ao tocar no link, o presente aparece animado e entra na coleção dele(a).</p></div>';
    $("#alb",pb).onclick=()=>K.pages.album();
    $$("[data-g]",pb).forEach(b=>b.onclick=()=>{sel=b.dataset.g;draw()});
    $$("[data-c]",pb).forEach(b=>b.onclick=()=>{const g=gf.recv.filter(x=>x.k===b.dataset.c).pop();if(g)playGift(g);else toast("Ainda não recebeu este")});
    $("#ad",pb).onclick=()=>K.adOverlay(()=>{gf.credits++;gf.ads++;save();toast("+1 presente 🎁");draw()});
    $("#send",pb).onclick=()=>{
      if(gf.credits<=0){toast("Sem presentes. Veja um anúncio para ganhar +1");return}
      const m=$("#gm",pb).value.trim(),g={id:Date.now().toString(36)+rnd(999),k:sel,m,f:S.names.a,d:Date.now()};
      gf.credits--;gf.sent.push({k:g.k,d:g.d});save();gain(5,2);
      playGift(g,()=>{share(gOf(sel).ic+" "+S.names.a+" te enviou um presente: "+gOf(sel).n+"!"+(m?"\n“"+m+"”":""),makeCode({t:"g",id:g.id,k:g.k,m:g.m||m,f:g.f,d:g.d}));draw()})}
   }})};
function receiveGift(o){
  if(S.gift.recv.some(x=>x.id===o.id)){toast("Você já abriu esse presente");return}
  const g={id:o.id,k:o.k,m:o.m,f:o.f,d:o.d,visto:true};S.gift.recv.push(g);save();playGift(g,()=>K.render(K.getCur()))}
K.useCode=function(txt){
  const o=parseCode(txt);if(!o)return false;
  if(o.t==="g"){receiveGift(o);return true}
  if(o.t==="c"){S.parceiro={n:o.n,starts:o.s,len:o.l,per:o.p};save();toast("Ciclo recebido ✓");K.pages.ciclo();return true}
  return false};

/* =====================  ALBUM POLAROID  ===================== */
K.pages.album=function(){
  openPage("Álbum Polaroid 📸",'<div id="al"></div>',pb=>{draw();
   async function draw(){
    const A=S.album;
    $("#al",pb).innerHTML='<p class="sm mut" style="margin-top:8px">Guardem as lembranças de vocês, como polaroids. As fotos ficam só no seu celular.</p><div class="album" id="grid">'+
      '<button class="addpol" id="add" type="button" aria-label="Adicionar foto">＋</button>'+A.slice().reverse().map(p=>'<button class="pol" type="button" data-id="'+p.id+'"><div class="ph" data-i="'+p.id+'"></div><p>'+esc(p.cap||"")+'</p><small>'+esc(p.date)+'</small></button>').join("")+'</div>'+
      '<div class="card"><h3>📦 Polaroid impressa (em breve)</h3><p class="sm mut" style="margin-top:4px">Em breve vocês poderão pedir as polaroids impressas, entregues em casa.</p><button class="btn ghost block" id="int" type="button">'+(S.interesse?"✓ Avisaremos você":"Tenho interesse")+'</button></div>';
    $("#int",pb).onclick=()=>{S.interesse=true;save();toast("Anotado! Avisaremos quando abrir");draw()};
    $("#add",pb).onclick=()=>{if(A.length>=60){toast("Álbum cheio (60 fotos)");return}const i=document.createElement("input");i.type="file";i.accept="image/*";i.onchange=async()=>{const f=i.files[0];if(!f)return;let u;try{u=await compress(f,720,.78)}catch(e){toast("Não consegui abrir a foto");return}
      openSheet('<h3>Nova polaroid</h3><div class="pol" style="margin:10px auto;max-width:220px"><div class="ph" style="background-image:url('+u+')"></div><p id="pv"></p></div><input class="field" id="cap" maxlength="30" placeholder="Legenda (ex.: Nosso primeiro cinema)"><button class="btn block" id="sv" type="button">Colocar no álbum</button>',sh=>{
        $("#sv",sh).onclick=async()=>{const id=Date.now().toString(36);await IDB.set("alb_"+id,u);A.push({id,cap:$("#cap",sh).value.trim(),date:new Date().toLocaleDateString("pt-BR")});save();closeSheet();gain(8,2);toast("Polaroid guardada 📸");draw()}})};i.click()};
    $$(".pol",pb).forEach(b=>b.onclick=async()=>{const id=b.dataset.id,p=A.find(x=>x.id===id);const u=await IDB.get("alb_"+id);
      openSheet('<div class="pol" style="margin:6px auto;max-width:320px;--r:-1deg"><div class="ph" style="background-image:url('+u+')"></div><p style="font-size:16px;white-space:normal">'+esc(p.cap||"")+'</p><small>'+esc(p.date)+'</small></div><button class="btn ghost block" id="del" type="button">Apagar esta polaroid</button>',sh=>{
        $("#del",sh).onclick=()=>K.ask("Apagar esta polaroid?","Apagar",async()=>{await IDB.del("alb_"+id);S.album=S.album.filter(x=>x.id!==id);save();K.pages.album()})})});
    for(const p of A){const u=await IDB.get("alb_"+p.id);const el=$('[data-i="'+p.id+'"]',pb);if(el&&u)el.style.backgroundImage="url("+u+")"}
   }})};

R.presentes=()=>K.pages.presentes();R.ciclo=()=>K.pages.ciclo();
})();
