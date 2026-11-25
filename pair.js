/* KIZUNA - pareamento de teste, simulador de notificacoes e conteudo dos widgets.
   TESTE: as mensagens passam por um servidor publico gratuito (ntfy.sh) usando um codigo secreto aleatorio.
   Nao use para segredos serios. Para producao o plano e trocar por Firebase (FCM). */
(function(){
"use strict";
const {$,$$,esc,toast,openSheet,closeSheet,makeCode,pick}=K;
const S=K.S(),save=K.save;
const RELAY="https://ntfy.sh/";
const P=()=>{if(!S.pair)S.pair={topic:"",me:"",since:0,last:"",lastMsg:null};return S.pair};
const rid=n=>{const a="abcdefghjkmnpqrstuvwxyz23456789";let s="";const r=crypto.getRandomValues(new Uint8Array(n));for(const b of r)s+=a[b%a.length];return s};
K.relayOn=()=>!!P().topic;
K.relaySend=async function(text,code){
  if(!K.relayOn())return false;
  try{const r=await fetch(RELAY+P().topic,{method:"POST",body:JSON.stringify({f:P().me,x:text,c:code||"",t:Date.now()})});return r.ok}catch(e){return false}};

/* ---------- notificacao local (app Android) ou do navegador ---------- */
const LN=()=>window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.LocalNotifications;
K.notify=async function(title,body,delay){
  try{const L=LN();
    if(L){let p=await L.checkPermissions();if(p.display!=="granted")p=await L.requestPermissions();if(p.display!=="granted")return false;
      await L.schedule({notifications:[{id:Math.floor(Math.random()*2e9),title,body,schedule:{at:new Date(Date.now()+(delay||400))}}]});return true}
    if("Notification" in window){let p=Notification.permission;if(p==="default")p=await Notification.requestPermission();
      if(p==="granted"){const o={body,icon:"icon-192.png",vibrate:[0,220,120,220],tag:"kizuna-"+Date.now()};const reg=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();if(reg)await reg.showNotification(title,o);else new Notification(title,o);return true}}
  }catch(e){}return false};

/* ---------- receber ---------- */
function incoming(p){
  P().lastMsg={x:p.x,t:p.t||Date.now()};save();
  const o=K.parseCode(p.c||"");
  const title=o&&o.t==="g"?"🎁 Você recebeu um presente":o&&o.t==="m"?"💛 Missão de cuidado":o&&o.t==="i"?"🤫 O KIZUNA tem uma pergunta para você":o&&o.t==="r"?"🎉 Deu match!":o&&o.t==="c"?"🌙 Dicas do ciclo atualizadas":"💌 Mensagem do seu amor";
  K.notify(title,(p.x||"").split("\n")[0].slice(0,120));
  if(p.c&&K.useCode(p.c))return;
  openSheet('<h3>💌 Mensagem do seu amor</h3><p style="margin-top:8px;white-space:pre-line">'+esc(p.x||"")+'</p>')}
let polling=false;
async function poll(){
  if(!K.relayOn()||polling||document.hidden)return;polling=true;
  try{const r=await fetch(RELAY+P().topic+"/json?poll=1&since="+(P().last||P().since));const t=await r.text();
    for(const line of t.split("\n")){if(!line.trim())continue;let m;try{m=JSON.parse(line)}catch(e){continue}
      if(m.event!=="message")continue;P().last=m.id;save();let p;try{p=JSON.parse(m.message)}catch(e){continue}
      if(p.f===P().me)continue;incoming(p)}
  }catch(e){}polling=false}
setInterval(poll,12000);document.addEventListener("visibilitychange",()=>{if(!document.hidden)poll()});setTimeout(poll,1500);

/* ---------- parear ---------- */
K.pairSheet=function(){
  const p=P();
  if(p.topic){
    openSheet('<h3>🔗 Pareado com o parceiro</h3><p class="sm mut" style="margin-top:6px">Tudo o que você enviar (humor, presentes, ideia secreta, ciclo) chega direto no celular dele(a) com aviso, enquanto o app estiver aberto.</p><div class="card"><div class="xs mut">Código de pareamento</div><b style="word-break:break-all">KZP-'+esc(p.topic)+'</b></div><button class="btn block" id="ping" type="button">Enviar um oi de teste</button><button class="btn ghost block" id="cp" type="button">Copiar código</button><button class="btn ghost block" id="un" type="button">Desfazer o pareamento</button><p class="xs mut" style="margin-top:10px">Modo de teste: as mensagens passam por um servidor público gratuito (ntfy.sh) com esse código secreto. Não use para segredos sérios. Na versão final isso vira Firebase.</p>',sh=>{
      $("#ping",sh).onclick=async()=>{const ok=await K.relaySend("💌 "+S.names.a+" mandou um oi pelo Kizuna!","");toast(ok?"Oi enviado ✓":"Sem internet agora")};
      $("#cp",sh).onclick=()=>{try{navigator.clipboard.writeText("KZP-"+p.topic);toast("Código copiado")}catch(e){toast("Copie manualmente")}};
      $("#un",sh).onclick=()=>K.ask("Desfazer o pareamento?","Desfazer",()=>{S.pair={topic:"",me:"",since:0,last:"",lastMsg:null};save();toast("Pareamento desfeito");K.render(K.getCur())})});return}
  openSheet('<h3>🔗 Parear com o parceiro</h3><p class="sm mut" style="margin-top:6px">Um de vocês cria o código e o outro digita. Depois disso, humor, presentes e ideias chegam direto, com aviso.</p><button class="btn block" id="mk" type="button">Criar um código</button><div class="hr"></div><label class="lb">Já recebeu um código?</label><input class="field" id="cd" placeholder="KZP-..."><button class="btn ghost block" id="jn" type="button">Entrar com o código</button><p class="xs mut" style="margin-top:10px">Modo de teste: usa um servidor público gratuito (ntfy.sh) com código secreto aleatório. Não use para segredos sérios.</p>',sh=>{
    const set=t=>{S.pair={topic:t,me:rid(8),since:Math.floor(Date.now()/1000)-30,last:"",lastMsg:null};save();closeSheet();K.pairSheet()};
    $("#mk",sh).onclick=()=>{const t="kz"+rid(18);set(t);K.share("🔗 Vamos parear o Kizuna! Abra o app > Perfil > Parear com o parceiro e digite este código:\nKZP-"+t)};
    $("#jn",sh).onclick=()=>{const m=$("#cd",sh).value.match(/KZP-([a-z0-9]{10,40})/i);if(!m){toast("Código inválido");return}set(m[1].toLowerCase());toast("Pareado! ✓")}})};

/* ---------- simulador: ver as notificacoes no proprio celular ---------- */
K.simular=function(kind){
  const nome=S.names.b,k=pick(["coracao","rosa","buque","urso","estrelas","carta","chocolate","beijo"],Math.floor(Math.random()*8));
  const sims={
    presente:{t:"🎁 "+nome+" te enviou um presente",b:"Toque para abrir a animação",c:{t:"g",id:"sim"+Date.now(),k,m:"Pensei em você hoje 💕",f:nome,d:Date.now()}},
    humor:{t:"💛 O dia de "+nome+" está corrido hoje",b:"Que tal um chá calmante e 5 min de massagem nos ombros?",c:{t:"m",n:nome,l:"Corrido",mi:"Massagem cervical de 5 minutos + chá de camomila.",p:["Óleo Térmico Relaxante VŌLVA","Aquece de leve e ajuda a soltar a tensão dos ombros."]}},
    ideia:{t:"🤫 O KIZUNA tem uma pergunta para você",b:"Alguém sugeriu uma ideia. Quer ver?",c:{t:"i",id:"sim"+Date.now(),x:"Banho a dois com vela"}},
    ciclo:{t:"🌙 Dicas do ciclo de "+nome,b:"Hoje é o dia 1. Veja o que fazer por ela.",c:{t:"c",n:nome,s:[K.today()],l:28,p:5}}
  }[kind];
  if(!sims)return;
  K.notify(sims.t,sims.b,1200);toast("Notificação chegando… (1 s)");
  setTimeout(()=>K.useCode(makeCode(sims.c)),1500)};

/* ---------- conteudo dos widgets (ela e ele) ---------- */
const SP=K.SPECIES;
K.widgetContent=function(role){
  const flor=SP[S.species],cy=window.KZ_cicloHoje&&KZ_cicloHoje();
  const lastG=S.gift.recv.slice(-1)[0];
  if(role==="ela"){
    if(S.ciclo&&cy)return {ic:cy.ic,title:cy.titulo.replace("Dia ","Dia ").split(" · ")[0].replace(/ do ciclo de .*/,"")+" · "+cy.titulo.split(" · ")[1],sub:cy.dica.t,tag:"Ciclo"};
    return {ic:flor.ic,title:"Jardim "+S.vit+"% · 🔥 "+S.streak+"d",sub:"Toque para cuidar da "+flor.s,tag:"Jardim"}}
  if(lastG&&Date.now()-(lastG.d||0)<864e5)return {ic:"🎁",title:"Presente de "+(lastG.f||"seu amor"),sub:"Toque para abrir a animação",tag:"Presente"};
  if(cy&&S.parceiro)return {ic:cy.ic,title:cy.titulo.split(" · ")[0],sub:"Dica: "+cy.dica.t,tag:"Ciclo"};
  if(cy)return {ic:cy.ic,title:cy.titulo.split(" · ")[0],sub:"Dica: "+cy.dica.t,tag:"Ciclo"};
  return {ic:flor.ic,title:"Jardim "+S.vit+"% · 🔥 "+S.streak+"d",sub:"A "+flor.s+" de vocês espera por você",tag:"Jardim"}};
let wt;
K.widgetSync=function(){
  clearTimeout(wt);wt=setTimeout(async()=>{
    try{const Pf=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.Preferences;if(!Pf)return;
      const c=K.widgetContent(S.role==="ela"?"ela":"ele");
      await Pf.set({key:"wg_ic",value:c.ic});await Pf.set({key:"wg_title",value:c.title});await Pf.set({key:"wg_sub",value:c.sub})}catch(e){}},900)};
})();
