/* KIZUNA 2.0 - tudo que existia no v1 e voltou: poderes que se somam, missoes, receitas,
   Linha Hot completa, temas por nivel, assinatura e convite, widget, instalar, notificacoes */
(function(){
"use strict";
const {$,$$,esc,toast,openSheet,closeSheet,openPage,fx,share,makeCode,pick,reduce}=K;
const S=K.S(),save=K.save,R=K.R,SP=K.SPECIES,ORDER=K.ORDER;
const gain=(...a)=>K.gain(...a);
const rnd=n=>Math.floor(Math.random()*n);const pad2=n=>String(n).padStart(2,"0");
const dk=k=>k+"@"+K.dnum();
const product=(n,d)=>'<div class="product"><span class="ic">🛍️</span><div><b class="sm">'+esc(n)+'</b><div class="xs mut">'+esc(d)+'</div></div></div>';
const brl=v=>"R$ "+v.toFixed(2).replace(".",",");
const dateIn=d=>new Date(Date.now()+d*864e5).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});

/* ---------- poderes que se somam (v1) ---------- */
const PEXTRA={lavender:["Óleo Hidratante Sensorial VŌLVA","Textura leve, ideal para massagem antes de dormir."],imperial_lily:["Vela Aromática de Massagem VŌLVA","Clima certo para a noite especial."]};
function markDone(sp,xp){const k=dk("pw_"+sp);if(S.done[k])return;S.done[k]=1;gain(xp||10,3);toast("+"+(xp||10)+" XP por usar o poder de hoje")}
function dailySheet(k,item,extra){
  const sp=SP[k];
  openSheet('<h3>'+sp.ic+" "+esc(sp.pw)+'</h3><p class="xs mut">Hoje · amanhã tem um novo</p><p style="font-weight:700;margin:10px 0 4px;font-size:17px">'+esc(item.t)+'</p><p>'+esc(item.b||item.d)+'</p>'+(item.steps?'<ol class="sm">'+item.steps.map(s=>"<li>"+esc(s)+"</li>").join("")+'</ol>':'')+(extra||'')+(PEXTRA[k]?product(PEXTRA[k][0],PEXTRA[k][1]):'')+
   '<button class="btn block" id="ok" type="button">'+(S.done[dk("pw_"+k)]?"Já feito hoje ✓":"Fizemos! (+10 XP)")+'</button>',sh=>{$("#ok",sh).onclick=()=>{closeSheet();markDone(k)}})}
K.openPower=function(k){
  const pw=K.powerFor(k);
  if(k==="rose"){
    let chosen=pick(LOVE);
    openSheet('<h3>🌹 Cartão de carinho</h3><p class="sm mut">Escolha como dizer hoje. Vale todos os dias, com palavras diferentes.</p><div class="chips" id="phr">'+LOVE.map(x=>'<button class="chip'+(x===chosen?" on":"")+'" type="button" data-ph="'+esc(x)+'">'+esc(x)+'</button>').join("")+'</div><button class="btn block" id="send" type="button">Enviar cartão animado</button>',sh=>{
      $$("[data-ph]",sh).forEach(b=>b.onclick=()=>{chosen=b.dataset.ph;$$("[data-ph]",sh).forEach(x=>x.classList.toggle("on",x===b))});
      $("#send",sh).onclick=()=>{closeSheet();markDone("rose",5);fx("🌹",14,{dir:"down"});share("🌹 "+S.names.a+" te mandou um cartão: “"+chosen+".”",makeCode({t:"g",id:"c"+Date.now().toString(36),k:"rosa",m:chosen,f:S.names.a,d:Date.now()}))}});return}
  if(k==="sakura"){const r=pw;
    openSheet('<h3>🌸 '+esc(r.t)+'</h3><p class="sm mut">'+esc(r.b)+'</p><div class="breath" id="br">Inspire</div><ol class="sm">'+r.steps.map(s=>"<li>"+esc(s)+"</li>").join("")+'</ol><button class="btn block" id="ok" type="button">'+(S.done[dk("pw_sakura")]?"Já feito hoje ✓":"Fizemos! (+10 XP)")+'</button>',sh=>{
      const el=$("#br",sh),ph=[["Inspire",4000,1.35],["Segure",4000,1.35],["Expire",6000,1]];let i=0,t;
      const step=()=>{const p=ph[i%3];el.textContent=p[0];el.style.transitionDuration=reduce?"1ms":p[1]+"ms";el.style.transform="scale("+p[2]+")";i++;t=setTimeout(step,p[1])};step();
      $("#ok",sh).onclick=()=>{closeSheet();markDone("sakura")};return()=>clearTimeout(t)});return}
  if(k==="golden_jasmine"){openSheet('<h3>✨ Giro surpresa garantido</h3><p class="sm mut">Hoje o Jasmim garante um prêmio:</p><p class="quote">'+esc(pick(PRIZES))+'</p><p class="sm">Vale também na roleta: com Jasmim, Lírio ou Lótus plantados, todo giro traz um prêmio extra.</p><button class="btn block" id="ok" type="button">Fizemos! (+10 XP)</button><button class="btn ghost block" id="gr" type="button">Ir para a roleta</button>',sh=>{$("#ok",sh).onclick=()=>{closeSheet();markDone(k)};$("#gr",sh).onclick=()=>{closeSheet();K.go("roleta")}});return}
  if(k==="lavender"||k==="sunflower"||k==="orchid"||k==="imperial_lily"||k==="hibiscus"){dailySheet(k,pw,k==="orchid"?'<p class="xs mut">Conversas curtas e diárias aproximam mais do que conversas longas e raras.</p>':'');return}
  if(k==="tulip"){dailySheet(k,pw,'<p class="xs mut">Cada um responde primeiro por escrito e depois comparam as respostas.</p>');return}
  if(k==="peony"){dailySheet(k,pw);return}
  openSheet('<h3>🪷 Carta-cápsula do tempo</h3><p class="sm mut">Escreva para o casal de vocês daqui a 30 dias. A carta fica guardada.</p><textarea class="field" id="cap" rows="5">'+esc(S.capsule||"Daqui a 30 dias quero lembrar de…")+'</textarea><button class="btn block" id="seal" type="button">Lacrar carta (+10 XP)</button>',sh=>{$("#seal",sh).onclick=()=>{S.capsule=$("#cap",sh).value;save();closeSheet();markDone(k);toast("Carta lacrada")}})};

/* ---------- widget ---------- */
function widgetSheet(){
  openSheet('<h3>📲 Veja sua flor florescer todo dia</h3><p class="sm mut">Com o widget na tela inicial você vê a flor, a sequência e o plano da noite sem abrir o app.</p><div class="card"><b>'+SP[S.species].ic+" Jardim "+S.vit+'% · 🔥 '+S.streak+'d</b><div class="xs mut">O Plano da Noite de hoje está pronto.</div></div><p class="sm"><b>Android</b>: segure a tela inicial, toque em Widgets e escolha KIZUNA (vem no app instalado pelo APK).</p><p class="sm"><b>iPhone</b>: segure a tela inicial, toque em + e escolha KIZUNA.</p><button class="btn block" id="y" type="button">Já adicionei (+20 XP)</button>',sh=>{
    $("#y",sh).onclick=()=>{closeSheet();if(!S.widget){S.widget=true;save();gain(20,0);toast("Widget ativo! +20 XP")}}})}
K.jardimExtra=function(el){
  const jx=$("#jx",el);
  const idx=ORDER.indexOf(S.species),list=ORDER.slice(0,idx+1);
  jx.innerHTML=(S.widget?'':'<div class="card row sp"><div style="flex:1"><b>Veja sua flor florescer todo dia</b><div class="xs mut">Adicione o widget. Ganhe +20 XP.</div></div><button class="btn" id="wBtn" type="button">Adicionar</button></div>')+
   '<div class="row" style="margin-top:12px"><button class="chip" id="nSoil" type="button">Avisar ao '+esc(S.names.b)+': colocar terra</button><button class="chip" id="nWater" type="button">Pedir rega</button></div>'+
   '<div class="card"><h3>Poderes da sua planta</h3><p class="xs mut">Cada planta soma o poder dela aos anteriores. O conteúdo muda todo dia.</p>'+list.map(k=>{const done=S.done[dk("pw_"+k)];return '<div class="mission'+(done?" done":"")+'"><span class="ck">'+SP[k].ic+'</span><div style="min-width:0"><b class="sm">'+esc(SP[k].pw)+(done||k==="midnight_lotus"?"":' <span class="pill">NOVO HOJE</span>')+'</b><div class="xs mut">'+esc(k==="midnight_lotus"?"Abre daqui a 30 dias":K.powerFor(k).t)+'</div></div><button class="chip" data-pw="'+k+'" type="button">Abrir</button></div>'}).join("")+'</div>';
  const jx2=$("#jx2",el);if(jx2){const t=new Date(),mk=(role,nome)=>{const c=K.widgetContent(role);return '<div class="lockmock"><div class="xs mut">📱 Widget de '+nome+'</div><div class="wg"><span class="sp">'+c.ic+'</span><span><b>'+esc(c.title)+'</b><div class="xs mut">'+esc(c.sub)+'</div></span></div></div>'};
    jx2.innerHTML='<div class="card"><h3>Como fica o widget</h3><p class="xs mut">Cada um vê o seu, com a mesma flor. Atualiza quando você sai do app.</p>'+mk("ela","ela")+mk("ele","ele")+'<div class="lockmock" style="margin-top:12px"><div class="xs mut">🔔 Notificação</div><div class="clk" style="font-size:30px;margin-top:6px">'+pad2(t.getHours())+':'+pad2(t.getMinutes())+'</div><div class="nt"><b>KIZUNA</b> · agora<br>'+(S.mood?'💛 '+esc(S.names.a)+' está '+esc((K.MOODS.find(m=>m.k===S.mood)||{l:""}).l.toLowerCase())+' hoje. Toque para ver a missão de cuidado.':'🎁 Você recebeu um presente! Toque para abrir.')+'</div></div></div>'}
  const w=$("#wBtn",el);if(w)w.onclick=widgetSheet;
  $("#nSoil",el).onclick=()=>share("🪴 "+S.names.a+" colocou terra no jardim. Agora falta a sua parte: regue a "+SP[S.species].s+" antes de dormir!");
  $("#nWater",el).onclick=()=>share("💧 A "+SP[S.species].s+" está com sede! "+S.names.a+" pediu: dá uma regada no jardim de vocês hoje?");
  $$("[data-pw]",el).forEach(b=>b.onclick=()=>K.openPower(b.dataset.pw))};

/* ---------- inicio: missao de cuidado, mensagem especial, dicas do dia ---------- */
const TIPS=[
 {t:"09:00",title:"☀️ Bom dia de vocês começa aqui",body:"Respondam o check-in: como está o dia de cada um?"},
 {t:"15:30",title:"🥞 Ótimo dia para um chá com panqueca!",body:"A receita e o passo a passo já estão no app.",rec:1},
 {t:"20:30",title:"🎬 Já escolheram o que assistir hoje?",body:"Cruzem os gostos (Série, Filme ou Anime) e recebam o roteiro da noite.",go:"noite"}
];
function recipeSheet(r){
  const yt="https://www.youtube.com/results?search_query="+encodeURIComponent(r.q),key=dk("rec:"+r.name);
  openSheet('<h3>'+esc(r.name)+'</h3><p class="xs mut">⏱ '+esc(r.time)+' · para dois · '+r.steps.length+' passos</p><a class="btn ghost block" href="'+yt+'" target="_blank" rel="noopener">▶ Ver vídeo passo a passo</a>'+
   '<b class="sm" style="display:block;margin-top:10px">Ingredientes</b><ul class="sm" style="margin:4px 0 8px;padding-left:18px">'+r.ing.map(i=>"<li>"+esc(i)+"</li>").join("")+'</ul><b class="sm">Modo de preparo (marque conforme faz)</b><div>'+r.steps.map((s,i)=>'<label class="chk"><input type="checkbox" data-s="'+i+'"><span>'+(i+1)+'. '+esc(s)+'</span></label>').join("")+'</div>'+product("Vela Aromática VŌLVA","Para transformar a refeição em um momento a dois.")+
   '<button class="btn block" id="rd" type="button" disabled>Marque todos os passos para concluir</button>',sh=>{
    const bx=$$("[data-s]",sh);bx.forEach(b=>b.onchange=()=>{b.closest(".chk").classList.toggle("done",b.checked);const all=bx.every(x=>x.checked),d=$("#rd",sh);d.disabled=!all;d.textContent=all?"Receita pronta! (+10 XP)":"Marque todos os passos para concluir"});
    $("#rd",sh).onclick=()=>{if(!S.done[key]){S.done[key]=1;gain(10,3)}closeSheet();toast("Bom apetite! 🍽️")}})}
/* mensagem especial: a bolinha de coracao no jardim */
K.especial=function(){
  const m=pick(SPECIAL),sp=S.special===K.dnum();
  if(!sp){openSheet('<h3>Mensagem especial do dia 💌</h3><p class="sm mut" style="margin-top:6px">Veja um anúncio curto e desbloqueie uma mensagem para mandar ao '+esc(S.names.b)+'. Muda todo dia.</p><button class="btn block" id="b" type="button">Ver anúncio e desbloquear</button>',sh=>{$("#b",sh).onclick=()=>{closeSheet();K.adOverlay(()=>{S.special=K.dnum();save();gain(10,2);toast("Mensagem desbloqueada! +10 XP");K.especial()})}});return}
  openSheet('<h3>Mensagem especial do dia 💌</h3><p class="quote">“'+esc(m)+'”</p><button class="btn block" id="s" type="button">Enviar para o '+esc(S.names.b)+'</button>',sh=>{$("#s",sh).onclick=()=>{closeSheet();share("💌 "+m)}})};
/* Missoes, dicas e conquistas (escondido no Perfil) */
K.pages.missoes=function(){
  const dm=S.dm,n=(dm.care?1:0)+(dm.mood?1:0)+(dm.spin?1:0);
  openPage("Missões e dicas 🏆",'<div class="card"><div class="row sp"><h3>Missões de hoje</h3><span class="pill">'+n+'/3</span></div><div class="bar" style="margin:8px 0 4px"><i style="width:'+(n/3*100)+'%"></i></div>'+
   [[dm.mood,"Contar como você está"],[dm.care,"Cuidar da flor (regar ou adubar)"],[dm.spin,"Girar a roleta e cumprir a tarefa"]].map(x=>'<div class="mission'+(x[0]?" done":"")+'"><span class="ck">'+(x[0]?"✓":"")+'</span><b class="sm">'+x[1]+'</b></div>').join("")+'<p class="xs mut" style="margin-top:6px">As 3 juntas valem +30 XP de bônus. Você ganha um aviso quando completar.</p></div>'+
   '<div class="card"><h3>Dicas ao longo do dia</h3>'+TIPS.map(t=>'<div class="tip"><span class="t">'+t.t+'</span><div><b class="sm">'+esc(t.title)+'</b><div class="xs mut">'+esc(t.body)+'</div>'+(t.rec?'<button class="lnk" data-tp="rec" type="button">Ver a receita</button>':'')+(t.go?'<button class="lnk" data-tp="go" type="button">Abrir</button>':'')+'</div></div>').join("")+'<p class="xs mut" style="margin-top:6px">Das 23h às 7h as dicas ficam em silêncio.</p></div>'+
   '<div class="card"><h3>Conquistas</h3><p class="sm">🔥 Sequência: <b>'+S.streak+'</b> dia(s)</p><p class="sm">🎡 Tarefas cumpridas: <b>'+S.roleta.feitas+'</b></p><p class="sm">🎁 Presentes enviados: <b>'+S.gift.sent.length+'</b> · recebidos: <b>'+S.gift.recv.length+'</b></p><p class="sm">🌸 Flores liberadas: <b>'+S.unlocked.length+'/11</b></p></div>',pb=>{
    $$("[data-tp]",pb).forEach(x=>x.onclick=()=>{if(x.dataset.tp==="rec"){K.closePage();recipeSheet(PANCAKE)}else{K.closePage();K.go("noite")}})})};

/* ---------- noite: ingredientes, receita, missao ---------- */
function buildRecipe(list){
  const ing=list.length?list:["pão","queijo","mel"],has=w=>ing.some(i=>i.toLowerCase().includes(w)),rest=ing.filter(i=>!/macarr|alho|ovo/i.test(i)).join(", ")||"o que tiver";let name,steps;
  if(has("macarr")){name="Macarrão cremoso da maratona";steps=["Cozinhe o macarrão em água fervente com sal até ficar al dente (8 a 10 minutos).","Doure o alho picado em fogo baixo com um fio de azeite ou manteiga, sem deixar queimar.","Junte "+rest+" e mexa em fogo baixo até engrossar.","Misture o macarrão no molho, acerte o sal e sirva em dois pratos antes do play."]}
  else if(has("ovo")){name="Omelete de cinema";steps=["Bata os ovos com uma pitada de sal.","Despeje na frigideira untada, em fogo baixo.","Quando firmar embaixo, recheie com "+rest+".","Dobre ao meio e divida em dois."]}
  else{name="Tostadas da noite";steps=["Corte "+ing[0]+" em fatias.","Monte com "+ing.slice(1).join(", ")+".","Leve à frigideira ou ao forno por 5 minutos.","Sirvam com uma bebida quente."]}
  return{name,time:"15 minutos",q:name+" receita fácil",ing,steps}}
function missionGuide(i){
  const m=MISSIONS[i%MISSIONS.length];
  openSheet('<h3>'+esc(m.t)+'</h3><p class="xs mut">⏱ '+esc(m.time)+' · para os dois</p><b class="sm">O que vocês precisam</b><div class="chips">'+m.need.map(n=>'<span class="chip">'+esc(n)+'</span>').join("")+'</div><b class="sm" style="display:block;margin-top:10px">Passo a passo</b><ol class="sm">'+m.steps.map(s=>"<li>"+esc(s)+"</li>").join("")+'</ol><p class="sm mut"><b>Dica:</b> '+esc(m.tip)+'</p>'+product(m.p,"Sugestão para esta missão.")+'<button class="btn block" id="g" type="button">Entendi, vamos fazer</button>',sh=>{
    $("#g",sh).onclick=()=>{S.viewed[i%MISSIONS.length]=1;save();closeSheet();K.render("noite");toast("Agora você pode marcar a missão")}})}
const oldNoite=R.noite;
R.noite=function(el){
  oldNoite(el);
  const idx=S.mi%MISSIONS.length,m=MISSIONS[idx],viewed=!!S.viewed[idx],done=!!S.done[dk("mission"+idx)];
  const ingTxt=S.ingr||"macarrão, creme de leite, parmesão, alho",rec=buildRecipe(ingTxt.split(",").map(s=>s.trim()).filter(Boolean));
  const box=document.createElement("div");
  box.innerHTML='<div class="card"><div class="xs mut">🕯️ Clima para o filme (opcional)</div><b>'+esc(m.t)+'</b><p class="sm" style="margin:4px 0 8px">Uma ideia simples para deixar a noite mais gostosa. Toque em “Saiba mais” para ver o que precisa e como fazer. Duração: '+esc(m.time)+'.</p><div class="row"><button class="chip" id="mo" type="button">Saiba mais</button><button class="chip'+(done?" on":"")+'" id="mk" type="button">'+(done?"✓ Missão feita":"Marcar missão")+'</button><button class="chip" id="ot" type="button">Outra dica</button></div></div>'+
   '<div class="card"><b>🍳 Quer cozinhar algo?</b><p class="sm mut" style="margin:4px 0">Escreva o que vocês têm em casa, separado por vírgula. O app sugere uma receita simples.</p><label class="lb" style="margin-top:2px">O que tem em casa?</label><input class="field" id="ig" value="'+esc(ingTxt)+'"><button class="pick" id="rc" type="button" style="width:100%;text-align:left"><b>'+esc(rec.name)+'</b><div class="xs mut">Sugestão: toque para ver os ingredientes e o passo a passo (⏱ '+esc(rec.time)+')</div></button></div>'+
   '<div class="card"><b>Depois do episódio 🔥</b><p class="sm" style="margin:4px 0 8px">Ideias a dois, jogos e roleta quente, sempre sem pressão.</p><button class="btn block" id="gh" type="button">Ir para a aba Hot</button></div>';
  el.appendChild(box);
  $("#mo",box).onclick=()=>missionGuide(idx);
  $("#mk",box).onclick=()=>{if(done)return;if(!viewed){toast("Veja o passo a passo antes de marcar");missionGuide(idx);return}S.done[dk("mission"+idx)]=1;gain(15,4);toast("Missão marcada! +15 XP");K.render("noite")};
  $("#ot",box).onclick=()=>{S.mi++;save();K.render("noite")};
  $("#ig",box).onchange=e=>{S.ingr=e.target.value;save();K.render("noite")};
  $("#rc",box).onclick=()=>recipeSheet(rec);
  $("#gh",box).onclick=()=>K.go("hot")};

/* ---------- Linha Hot completa ---------- */
const IDEAS=["Banho a dois com vela","Massagem com óleo","Jantar surpresa em casa","Noite sem celular","Café da manhã na cama","Dançar juntinhos na sala"];
const DAYS=["Hoje à noite","Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];
const whenTxt=d=>d==="Hoje à noite"?"hoje à noite":(/^(Sábado|Domingo)$/.test(d)?"no ":"na ")+d.toLowerCase();
function matchSheet(sec){
  let sel=sec.when||"Hoje à noite";
  openSheet('<h3>🎉 Vocês deram match!</h3><p class="quote">“'+esc(sec.text)+'”</p><p class="sm">Os dois toparam. Façam ainda hoje ou marquem um dia da semana.</p><div class="chips">'+DAYS.map(d=>'<button class="chip'+(d===sel?" on":"")+'" type="button" data-d="'+d+'">'+d+'</button>').join("")+'</div><button class="btn block" id="ok" type="button">Confirmar e avisar</button>',sh=>{
    $$("[data-d]",sh).forEach(b=>b.onclick=()=>{sel=b.dataset.d;$$("[data-d]",sh).forEach(x=>x.classList.toggle("on",x===b))});
    $("#ok",sh).onclick=()=>{sec.when=sel;save();closeSheet();gain(20,5);share("📅 Combinado "+whenTxt(sel)+": “"+sec.text+"”. Já está marcado para nós dois! 🔥")}})}
function secretCard(box,rerender){
  const s=S.secret,inn=S.secretIn;let h='<div class="card"><h3>Ideia secreta 🤫</h3>';
  if(inn&&!inn.answer)h+='<p class="sm">Chegou uma pergunta secreta para você.</p><button class="btn block" id="ans" type="button">Ver a pergunta</button>';
  if(inn&&inn.answer==="yes")h+='<p class="sm mut">Você topou: “'+esc(inn.text)+'”.</p><button class="btn ghost block" id="rep" type="button">Avisar que deu match</button>';
  if(!s)h+='<p class="sm mut" style="margin:4px 0 8px">Escreva uma ideia. Seu amor recebe como uma pergunta do app, sem saber que foi você. Só se os dois disserem sim ela aparece.</p><div class="chips">'+IDEAS.map(x=>'<button class="chip" type="button" data-id="'+esc(x)+'">'+esc(x)+'</button>').join("")+'</div><textarea class="field" id="stx" rows="2" placeholder="Escreva a sua ideia"></textarea><button class="btn hot block" id="ssend" type="button">Enviar em segredo</button>';
  else h+='<p class="quote">“'+esc(s.text)+'”</p><p class="sm mut">'+(s.status==="match"?"Deu match! Escolha quando.":"Enviada em segredo. Se ele(a) não quiser, ninguém fica sabendo.")+'</p>'+(s.status==="match"?'<button class="btn block" id="smt" type="button">'+(s.when?"Marcado "+whenTxt(s.when)+" ✓ (mudar)":"Escolher quando")+'</button>':'')+'<button class="chip" id="snew" type="button" style="margin-top:8px">Nova ideia</button>';
  box.innerHTML=h+'</div>';
  $$("[data-id]",box).forEach(b=>b.onclick=()=>{$("#stx",box).value=b.dataset.id});
  const se=$("#ssend",box);if(se)se.onclick=()=>{const v=$("#stx",box).value.trim();if(!v){toast("Escreva ou escolha uma ideia");return}S.secret={id:"s"+Date.now().toString(36),text:v,status:"sent",when:null};save();rerender();share("🤫 O KIZUNA tem uma pergunta para você. Alguém sugeriu uma ideia. Abra para ver (só você saberá sua resposta).",makeCode({t:"i",id:S.secret.id,x:v}))};
  const sn=$("#snew",box);if(sn)sn.onclick=()=>{S.secret=null;save();rerender()};
  const sm=$("#smt",box);if(sm)sm.onclick=()=>matchSheet(S.secret);
  const an=$("#ans",box);if(an)an.onclick=()=>answerSheet(rerender);
  const rp=$("#rep",box);if(rp)rp.onclick=()=>share("🎉 Deu match! Eu topei a ideia secreta 🔥",makeCode({t:"r",id:inn.id,y:1}))}
function answerSheet(rerender){
  const inn=S.secretIn;if(!inn||inn.answer)return;
  openSheet('<h3>🤫 Pergunta do KIZUNA</h3><p class="sm mut">Alguém sugeriu uma ideia. Você não vê quem, e só você sabe a sua resposta.</p><p class="quote">“'+esc(inn.text)+'”</p><p class="xs mut">Se os dois disserem sim, a ideia aparece para vocês em destaque. Se disser não, ninguém é avisado.</p><div class="row"><button class="btn" id="qy" type="button">Sim 🔥</button><button class="btn ghost" id="qn" type="button">Não, obrigado</button></div>',sh=>{
    $("#qy",sh).onclick=()=>{inn.answer="yes";save();closeSheet();share("🎉 Deu match! Eu topei a ideia secreta 🔥",makeCode({t:"r",id:inn.id,y:1}));rerender&&rerender()};
    $("#qn",sh).onclick=()=>{inn.answer="no";save();closeSheet();toast("Resposta guardada em segredo. Ninguém é avisado.");rerender&&rerender()}})}
function secretMatch(){
  const ideas=["Banho a dois","Massagem com óleo","Noite sem celular","Jantar fora","Dormir abraçados","Café da manhã na cama"],marks=[new Set(),new Set()];let step=0;
  function draw(sh){
    if(step<2){sh.innerHTML='<div class="grab"></div><h3>Match Secreto · vez de '+esc(step?S.names.b:S.names.a)+'</h3><p class="sm mut">Marque em segredo o que gostaria. Só aparece o que os dois marcarem.</p>'+ideas.map((t,i)=>'<div class="secret"><span>'+esc(t)+'</span><button type="button" data-i="'+i+'" class="'+(marks[step].has(i)?"on":"")+'">'+(marks[step].has(i)?"♥":"♡")+'</button></div>').join("")+'<button class="btn block" id="nx" type="button">'+(step?"Revelar matches":"Passar o celular para "+esc(S.names.b))+'</button>';
      $$("[data-i]",sh).forEach(b=>b.onclick=()=>{const i=+b.dataset.i;marks[step].has(i)?marks[step].delete(i):marks[step].add(i);draw(sh)});
      $("#nx",sh).onclick=()=>{step++;draw(sh)}}
    else{const m=[...marks[0]].filter(i=>marks[1].has(i)).map(i=>ideas[i]);sh.innerHTML='<div class="grab"></div><h3>Resultado</h3>'+(m.length?'<p class="quote">'+m.map(esc).join("<br>")+'</p><p class="sm">Vocês combinam nisso! 🔥</p>':'<p class="sm">Nenhum match desta vez. Tudo bem: o que não combinou continua em segredo.</p>')+'<button class="btn ghost block" data-x type="button">Fechar</button>';$("[data-x]",sh).onclick=closeSheet;if(m.length)fx("🔥",10)}}
  openSheet('',sh=>{draw(sh)})}
let hotTab="roleta";
function listaDicas(arr){return arr.map(d=>'<div class="pick"><b>'+esc(d.t)+'</b><div class="sm" style="margin-top:3px">'+esc(d.b)+'</div></div>').join("")}
function massagem(m){return '<div class="card"><h3>'+esc(m.t)+'</h3><ol class="sm" style="padding-left:18px">'+m.passos.map(p=>"<li>"+esc(p)+"</li>").join("")+'</ol><p class="sm mut"><b>Dica:</b> '+esc(m.dica)+'</p>'+product("Óleo Térmico Corporal VŌLVA","Aquece de leve e desliza bem na massagem.")+'</div>'}
K.secretSheet=function(){openSheet('<div id="sc"></div>',sh=>{const re=()=>secretCard($("#sc",sh),re);re()})};
K.pages.hot=function(){
  const vip=()=>S.plan!=="free_slim"||ORDER.indexOf(S.species)>=ORDER.indexOf("imperial_lily");
  openPage("Linha Hot 🔥",'<div id="hb"></div>',pb=>{body()
    function body(){
      const box=$("#hb",pb);
      if(!S.roleta.adult){box.innerHTML='<div class="card"><h3>Só para maiores de 18 🔞</h3><p class="sm" style="margin-top:6px">Ideias e jogos só para o casal, sempre opcionais e com consentimento: qualquer um pode dizer “hoje não” sem explicar.</p><button class="btn hot block" id="ad" type="button">Tenho 18 anos ou mais, entrar</button></div>';$("#ad",box).onclick=()=>{S.roleta.adult=true;save();body()};return}
      box.innerHTML='<div class="chips" style="margin-top:10px">'+[["roleta","🎡 Roleta Hot"],["dicas","💋 Dicas"],["massagem","💆 Massagem"],["jogos","🎲 Jogos"]].map(a=>'<button class="chip'+(hotTab===a[0]?" on":"")+'" data-t="'+a[0]+'" type="button">'+a[1]+'</button>').join("")+'</div><div id="ht"></div>';
      $$("[data-t]",box).forEach(b=>b.onclick=()=>{hotTab=b.dataset.t;body()});
      const t=$("#ht",box);
      if(hotTab==="roleta")K.wheelUI(t,{list:KZ_ROLETAS.hot,key:"hot",hot:1});
      else if(hotTab==="dicas")t.innerHTML='<h3 style="margin:14px 2px 0">Para ele fazer por ela 💗</h3>'+listaDicas(KZ_HOT.paraEla)+'<h3 style="margin:18px 2px 0">Para ela fazer por ele 💙</h3>'+listaDicas(KZ_HOT.paraEle)+'<div class="card" style="margin-top:14px"><h3>🔓 Dica premium para a noite</h3><p class="xs mut">Veja um anúncio e desbloqueie uma dica de como deixar a sua noite ainda melhor. Até 3 por dia.</p><div id="pr"></div><button class="btn hot block" id="prB" type="button">Desbloquear uma dica</button></div><div class="card" style="margin-top:14px"><h3>Esquentando a noite</h3><p class="xs mut">Três ideias novas por dia.</p>'+[0,1,2].map(i=>'<button type="button" class="pick" data-h="'+i+'" style="width:100%;text-align:left"><b>🔥 '+esc(pick(HOT,i).t)+'</b><div class="xs mut">Toque para ver como fazer</div></button>').join("")+'</div>';
      if(hotTab==="dicas"){const pr=S.dm.prem||(S.dm.prem=[]);const drawP=()=>{$("#pr",t).innerHTML=pr.map(i=>'<div class="pick"><b>⭐ '+esc(KZ_HOT.premium[i].t)+'</b><div class="sm" style="margin-top:3px">'+esc(KZ_HOT.premium[i].b)+'</div></div>').join("");$("#prB",t).hidden=pr.length>=3};drawP();$("#prB",t).onclick=()=>K.adOverlay(()=>{let i=(K.dnum()*3+pr.length)%KZ_HOT.premium.length;pr.push(i);save();gain(5,1);drawP();toast("Dica desbloqueada!")})}
      if(hotTab==="massagem")t.innerHTML='<div style="height:10px"></div>'+massagem(KZ_HOT.massEla)+massagem(KZ_HOT.massEle);
      else if(hotTab==="jogos"){t.innerHTML='<div class="card" style="margin-top:12px"><h3>Jogos para os dois</h3>'+KZ_HOT.jogos.map(j=>'<div class="pick"><b>'+j.e+' '+esc(j.t)+'</b><div class="sm" style="margin-top:3px">'+esc(j.b)+'</div></div>').join("")+'</div>'+
        '<div class="card row sp"><div style="flex:1"><h3>Match Secreto</h3><div class="xs mut">Cada um marca em segredo. Só aparece o que os dois quiseram.</div></div><button class="btn hot" id="ms" type="button">Abrir</button></div>'+
        '<div class="card row sp"><div style="flex:1"><h3>Dado VIP</h3><div class="xs mut">'+(vip()?"Role e descubra uma ideia especial para hoje.":"Disponível no plano VIP ou com o Lírio Imperial plantado.")+'</div></div><button class="btn hot" id="dd" type="button">'+(vip()?"Rolar":"Ver planos")+'</button></div>'+
        '<div id="sc"></div><button class="btn hot block" id="inv" type="button">Convidar o '+esc(S.names.b)+' para a noite 🔥</button><div class="card"><h3>Para a noite</h3>'+(()=>{const p=pick(HOT,3).p;return product(p[0],p[1])})()+'</div>';
        $("#inv",t).onclick=()=>share("🔥 "+S.names.a+" te convidou para a noite. Sem pressão: responda “bora” ou “hoje não” 💛");
        $("#ms",t).onclick=secretMatch;
        $("#dd",t).onclick=()=>{if(!vip()){K.go("perfil");toast("Veja os planos em Perfil");return}const n=1+rnd(6),idea=pick(LILY,n);openSheet('<div class="dice">🎲 '+n+'</div><p style="text-align:center;font-weight:700;margin-top:6px">'+esc(idea.t)+'</p><p style="text-align:center">'+esc(idea.b)+'</p>')};
        const rerender=()=>secretCard($("#sc",t),rerender);rerender()}
      $$("[data-h]",box).forEach(b=>b.onclick=()=>{const h=pick(HOT,+b.dataset.h);openSheet('<h3>🔥 '+esc(h.t)+'</h3><p style="margin-top:8px">'+esc(h.d)+'</p><p class="xs mut" style="margin-top:8px">Tudo é opcional. Qualquer um pode parar a qualquer momento.</p>'+product(h.p[0],h.p[1]))})
    }})};
K.R.hot=()=>K.pages.hot();
/* codigos novos: ideia secreta (i) e resposta (r) */
const oldUse=K.useCode;
K.useCode=function(txt){
  const o=K.parseCode(txt);
  if(o&&o.t==="m"){openSheet('<h3>💛 Missão de cuidado</h3><p class="sm mut">'+esc(o.n)+' está '+esc((o.l||"").toLowerCase())+' hoje.</p><p style="margin-top:8px"><b>Missão para você realizar em '+esc(o.n)+':</b></p><p class="quote">'+esc(o.mi)+'</p><ol class="sm"><li>Separe 5 minutos sem celular.</li><li>Prepare o ambiente: luz baixa e algo quente para beber.</li><li>Faça a missão e marque como feita para ganhar +25 XP.</li></ol>'+(o.p?product(o.p[0],o.p[1]):'')+'<button class="btn block" id="dm" type="button">Marcar missão como feita</button>',sh=>{$("#dm",sh).onclick=()=>{closeSheet();gain(25,8);toast("Missão concluída! +25 XP")}});return true}
  if(o&&o.t==="i"){S.secretIn={id:o.id,text:o.x,answer:null};save();K.pages.hot();setTimeout(()=>answerSheet(()=>K.pages.hot()),400);return true}
  if(o&&o.t==="r"){if(S.secret&&S.secret.id===o.id){S.secret.status="match";save();K.pages.hot();setTimeout(()=>matchSheet(S.secret),400)}else toast("Esse código é de outra ideia");return true}
  return oldUse(txt)};

/* ---------- perfil: menu, planos, assinatura, convite, teste ---------- */
const PLANS=[["free_slim","Slim","Grátis com anúncios premiados","R$ 0"],["individual_vip","Individual","Sem anúncios, 11 plantas, Dado VIP e IA ilimitada","R$ 20/mês"],["couple_passport","Casal","Tudo do Individual para os dois, com um só pagamento","R$ 30/mês"]];
const TRIAL=7,PRICE={individual_vip:20,couple_passport:30},INVITE={mode:"price",couplePrice:19.90,extraDays:7,windowH:24};
const BEN=["Sem anúncios","As 11 plantas e todos os poderes","Dado VIP e roleta completa","Plano da noite com IA ilimitado"];
const bonusText=()=>INVITE.mode==="price"?"o 1º mês do casal sai por "+brl(INVITE.couplePrice)+" em vez de "+brl(PRICE.couple_passport):"o teste ganha +"+INVITE.extraDays+" dias grátis ("+(TRIAL+INVITE.extraDays)+" no total)";
const viral=d=>d>=30?60:d>=14?40:d>=7?20:0;
function paywall(id,after){
  if(id==="free_slim"){toast("Ao cancelar, você volta ao Slim automaticamente");return}
  const price=PRICE[id],couple=id==="couple_passport";
  openSheet('<h3>'+(couple?"Casal":"Individual")+' · '+TRIAL+' dias grátis</h3><p class="sm mut">Depois, '+brl(price)+' por mês, cobrados automaticamente. Cancele quando quiser, sem multa.</p><div class="card"><ul class="sm" style="margin:0;padding-left:18px">'+BEN.map(b=>"<li>"+b+"</li>").join("")+(couple?"<li>Vale para os dois com um só pagamento</li>":"")+'</ul></div><div class="card"><div class="row sp"><span class="sm">Hoje</span><b>R$ 0,00</b></div><div class="row sp"><span class="sm">Dia 5</span><span class="sm mut">Lembrete no app</span></div><div class="row sp"><span class="sm">'+dateIn(TRIAL)+'</span><b>'+brl(price)+'</b></div></div>'+(couple?'<p class="sm">🎁 Convide seu parceiro pelo link. Se ele ativar em até '+INVITE.windowH+' h, '+bonusText()+'.</p>':'')+'<button class="btn block" id="go" type="button">Começar '+TRIAL+' dias grátis</button><p class="xs mut" style="margin-top:8px">Por enquanto o app é todo grátis: nenhuma cobrança real. A cobrança automática só começa na loja (Play Store).</p>',sh=>{
    $("#go",sh).onclick=()=>{S.plan=id;S.trial={start:Date.now(),id};S.invite=null;save();closeSheet();K.render("perfil");toast("Teste grátis ativado");if(couple)setTimeout(inviteSheet,350)}})}
function inviteSheet(){
  if(!S.invite){S.invite={sentAt:Date.now(),status:"pending"};save()}
  const link=K.SITE+"?convite=casal",st=S.invite.status;
  openSheet('<h3>Convide o '+esc(S.names.b)+' 💞</h3><p class="sm mut">Mande o link. Se ele ativar em até '+INVITE.windowH+' h, '+bonusText()+'.</p><div class="card"><div class="xs mut">Link</div><b style="word-break:break-all">'+link+'</b></div><div class="row"><button class="btn" id="cp" type="button">Copiar link</button><button class="btn ghost" id="sh" type="button">Compartilhar</button></div><p class="sm" style="margin-top:12px">'+(st==="bonus"?"🎉 Ele ativou a tempo! Bônus liberado: "+bonusText()+".":st==="expired"?"O prazo de "+INVITE.windowH+" h acabou. Ele ainda pode entrar, sem o bônus.":"⏳ Aguardando. Faltam "+INVITE.windowH+" h para o bônus.")+'</p>'+(st==="pending"?'<div class="row" style="margin-top:8px"><button class="chip" id="ok" type="button">Simular: ele ativou</button><button class="chip" id="late" type="button">Simular: passaram '+INVITE.windowH+' h</button></div>':''),sh=>{
    $("#cp",sh).onclick=async()=>{try{await navigator.clipboard.writeText(link);toast("Link copiado")}catch(e){toast("Copie o link manualmente")}};
    $("#sh",sh).onclick=()=>share("Vem cuidar do nosso jardim comigo? "+link);
    const ok=$("#ok",sh);if(ok){ok.onclick=()=>{S.invite.status="bonus";save();K.render("perfil");inviteSheet();gain(30,5)};$("#late",sh).onclick=()=>{S.invite.status="expired";save();K.render("perfil");inviteSheet()}}})}
const isStandalone=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
const localNotifs=()=>window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.LocalNotifications;
async function nativeNotify(title,body,delay){const L=localNotifs();if(!L)return false;try{let p=await L.checkPermissions();if(p.display!=="granted")p=await L.requestPermissions();if(p.display!=="granted")return false;await L.schedule({notifications:[{id:Math.floor(Math.random()*2e9),title,body,schedule:{at:new Date(Date.now()+(delay||500))}}]});return true}catch(e){return false}}
async function testNotif(){
  try{
    if(localNotifs()){const ok=await nativeNotify("💛 O dia do seu amor está corrido hoje","Que tal um chá calmante e 5 min de massagem nos ombros quando se encontrarem?",2000);await nativeNotify("🥞 Ótimo dia para um chá com panqueca!","A receita e o passo a passo já estão no app.",9000);toast(ok?"Notificações de teste chegam em 2 s e 9 s":"Permissão de notificação negada");return}
    if(!("Notification" in window)){toast("Este navegador não suporta notificações");return}
    let p=Notification.permission;if(p!=="granted")p=await Notification.requestPermission();if(p!=="granted"){toast("Permissão de notificação negada");return}
    const t="💛 O dia do seu amor está corrido hoje",o={body:"Que tal um chá calmante e 5 min de massagem nos ombros quando se encontrarem?",icon:"icon-192.png",vibrate:[0,220,120,220],tag:"kizuna-teste"};
    const reg=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();if(reg)await reg.showNotification(t,o);else new Notification(t,o);toast("Notificação de teste enviada")
  }catch(e){toast("Aqui não foi possível notificar. Abra o app instalado.")}}
function installSheet(){
  openSheet('<h3>📥 Instalar no celular</h3>'+(isStandalone()?'<p class="sm mut">O KIZUNA já está instalado neste aparelho. ✓</p>':'<p class="sm mut">Deixe o ícone na tela inicial e abra como um app, em tela cheia.</p><p class="sm"><b>Android (Chrome)</b>: menu ⋮ → Instalar app.</p><p class="sm"><b>iPhone (Safari)</b>: Compartilhar → Adicionar à Tela de Início.</p>')+(K.deferred?'<button class="btn block" id="ig" type="button">Instalar agora</button>':'')+'<button class="btn ghost block" id="nt" type="button">Enviar notificação de teste</button><p class="xs mut" style="margin-top:8px">Widget de verdade na tela inicial só existe no app Android (APK).</p>',sh=>{
    const g=$("#ig",sh);if(g)g.onclick=async()=>{try{K.deferred.prompt();await K.deferred.userChoice}catch(e){}K.deferred=null;closeSheet()};$("#nt",sh).onclick=testNotif})}
K.perfilExtra=function(el){
  const pe=$("#pextra",el),nThemes=1;
  const flameName=d=>d>=30?"Chama Eterna":d>=7?"Chama Intensa":"Chama Viva";
  pe.innerHTML='<div class="card" style="padding:4px 14px"><div class="menu">'+
   '<button class="mrow" id="mPair" type="button"><span class="mi">🔗</span><span class="mt"><b>Parear com o parceiro</b><span>'+(K.relayOn()?"Pareado ✓ (teste)":"Teste: mensagens e presentes chegam direto")+'</span></span><span class="ch">›</span></button>'+
   '<button class="mrow" id="mMiss" type="button"><span class="mi">🏆</span><span class="mt"><b>Missões, dicas e conquistas</b><span>Suas missões do dia e a sequência</span></span><span class="ch">›</span></button>'+
   '<button class="mrow" id="mShare" type="button"><span class="mi">💞</span><span class="mt"><b>Compartilhe o jardim</b><span>'+viral(S.streak)+'% OFF depois de 7 dias seguidos</span></span><span class="ch">›</span></button>'+
   '<button class="mrow" id="mWidget" type="button"><span class="mi">📲</span><span class="mt"><b>Widget na tela inicial</b><span>'+(S.widget?"Adicionado ✓":"Ainda não adicionado. Toque para ver como.")+'</span></span><span class="ch">›</span></button>'+
   '<button class="mrow" id="mInstall" type="button"><span class="mi">📥</span><span class="mt"><b>Instalar no celular</b><span>Ícone na tela inicial e notificação de teste</span></span><span class="ch">›</span></button>'+
   '<button class="mrow" id="mNotif" type="button"><span class="mi">🔔</span><span class="mt"><b>Notificações</b><span>Alertas, dicas e horário de silêncio</span></span><span class="ch">›</span></button>'+
   '<button class="mrow" id="mHow" type="button"><span class="mi">❓</span><span class="mt"><b>Como o Kizuna funciona</b><span>Um guia rápido para o casal</span></span><span class="ch">›</span></button></div></div>'+
   '<div class="card"><h3>Planos</h3><div id="subStatus"></div><div id="plans"></div><p class="xs mut" style="margin-top:8px">7 dias grátis em todos os planos pagos, depois cobrança automática (só quando o app for para a loja). Por enquanto: nenhuma cobrança real.</p></div>'+
   '<div class="card"><h3>Simular notificações</h3><p class="xs mut">Teste sozinho: o app finge que seu amor mandou algo, e você vê a notificação e a tela que ele(a) veria.</p><div class="chips"><button class="chip" data-sim="presente" type="button">🎁 Presente</button><button class="chip" data-sim="humor" type="button">💛 Humor e missão</button><button class="chip" data-sim="ideia" type="button">🤫 Ideia secreta</button><button class="chip" data-sim="ciclo" type="button">🌙 Ciclo</button></div></div><div class="card"><h3>Modo teste</h3><p class="xs mut">Para ver o app evoluir sem esperar.</p><div class="chips"><button class="chip" id="dDay" type="button">Avançar 1 dia</button><button class="chip" id="dXp" type="button">+100 XP (subir nível)</button><button class="chip" id="dWid" type="button">Mostrar aviso do widget</button><button class="chip" id="dWit" type="button">Simular jardim abandonado</button><button class="chip" id="dBon" type="button">Bônus do convite: '+(INVITE.mode==="price"?"R$ 19,90 no 1º mês":"+1 semana grátis")+'</button></div><p class="xs mut" style="margin-top:8px">Dia +'+(S.dayOffset||0)+' · nível '+S.level+'</p></div>';
  $("#plans",pe).innerHTML=PLANS.map(p=>'<div class="plan'+(S.plan===p[0]?" cur":"")+'"><div style="min-width:0"><b>'+p[1]+'</b><div class="xs mut">'+p[2]+'</div></div><div style="text-align:right"><div class="price">'+p[3]+'</div>'+(S.plan===p[0]?'<span class="xs mut">plano atual</span>':'<button class="chip" data-p="'+p[0]+'" type="button">'+(p[0]==="free_slim"?"Usar grátis":"7 dias grátis")+'</button>')+'</div></div>').join("");
  $$("[data-p]",pe).forEach(b=>b.onclick=()=>paywall(b.dataset.p));
  const ss=$("#subStatus",pe);if(S.trial){const pr=PRICE[S.trial.id],bonus=S.invite&&S.invite.status==="bonus",extra=bonus&&INVITE.mode==="week"?INVITE.extraDays:0,first=bonus&&INVITE.mode==="price"?INVITE.couplePrice:pr;
    ss.innerHTML='<div class="boss" style="margin:8px 0"><b>Teste grátis ativo</b><p class="sm" style="margin-top:4px">Acesso total até '+dateIn(TRIAL+extra)+'. Depois, '+brl(first)+(first!==pr?" no 1º mês e "+brl(pr)+" nos seguintes":"/mês")+'.</p>'+(S.trial.id==="couple_passport"?'<button class="chip" id="sInv" type="button">Convite do parceiro</button> ':'')+'<button class="chip" id="sCan" type="button">Cancelar teste</button></div>';
    const i=$("#sInv",pe);if(i)i.onclick=inviteSheet;$("#sCan",pe).onclick=()=>{S.plan="free_slim";S.trial=null;S.invite=null;save();K.render("perfil");toast("Teste cancelado. Você voltou ao Slim.")}}
  $("#mPair",pe).onclick=()=>K.pairSheet();
  $$("[data-sim]",pe).forEach(b=>b.onclick=()=>K.simular(b.dataset.sim));
  $("#mMiss",pe).onclick=()=>K.pages.missoes();
  $("#mShare",pe).onclick=()=>openSheet('<h3>Compartilhe o jardim</h3><p class="sm mut">Depois de 7 dias seguidos, cada convite aceito vale desconto. Quanto maior a sequência, maior o desconto.</p><div class="bar" style="margin:10px 0"><i style="width:'+Math.min(100,S.streak/30*100)+'%"></i></div><div class="row sp xs mut"><span>7d · 20%</span><span>14d · 40%</span><span>30d · 60%</span></div><div class="card" style="text-align:center;background:linear-gradient(160deg,#3b1640,#c2185b)"><div style="font-size:48px">'+SP[S.species].ic+'</div><b style="font-family:Georgia,serif;font-size:20px">'+esc(S.names.a)+' &amp; '+esc(S.names.b)+'</b><div class="sm">🔥 '+S.streak+' dias cuidando do jardim · Nível '+S.level+'</div><div class="xs" style="margin-top:8px;opacity:.85">'+flameName(S.streak)+' · '+viral(S.streak)+'% OFF no primeiro mês</div></div><button class="btn block" id="sh" type="button">Compartilhar</button>',sh=>{$("#sh",sh).onclick=()=>share("🔥 "+S.streak+" dias cuidando do nosso jardim no Kizuna! "+K.SITE)});
  $("#mWidget",pe).onclick=()=>S.widget?openSheet('<h3>📲 Widget ativo</h3><p>Seu widget está na tela inicial e mostra a flor, a sequência e o plano da noite.</p>'):widgetSheet();
  $("#mInstall",pe).onclick=installSheet;
  $("#mNotif",pe).onclick=()=>{const rows=[["checkin","Alertas de humor do parceiro"],["tips","Dicas ao longo do dia"],["quiet","Silêncio das 23h às 7h"]];
    openSheet('<h3>Notificações</h3>'+rows.map(r=>'<div class="sw-row"><span>'+r[1]+'</span><button class="tg" type="button" role="switch" aria-checked="'+S.prefs[r[0]]+'" data-pf="'+r[0]+'"></button></div>').join("")+'<p class="xs mut" style="margin-top:8px">Alertas fortes têm vibração dupla. Conteúdo íntimo fica oculto na tela bloqueada.</p>',sh=>{$$("[data-pf]",sh).forEach(b=>b.onclick=()=>{const k=b.dataset.pf;S.prefs[k]=!S.prefs[k];save();b.setAttribute("aria-checked",S.prefs[k])})})};
  $("#mHow",pe).onclick=()=>openSheet('<h3>Como o Kizuna funciona</h3><ol class="sm"><li><b>Jardim:</b> os dois cuidam da mesma flor com terra e água. Quanto mais cuidam, mais o jardim sobe de nível.</li><li><b>Poderes:</b> cada planta nova soma um poder aos anteriores. O conteúdo muda todo dia.</li><li><b>Início:</b> conte como está seu dia e o outro recebe uma dica de como cuidar.</li><li><b>Roletas:</b> Slim para o dia a dia e Hot para a noite, com tarefas a dois.</li><li><b>Ciclo:</b> o parceiro recebe dicas de cada fase.</li><li><b>Presentes e Álbum:</b> mande carinho animado e guarde polaroids.</li><li><b>Noite:</b> série, filme ou anime que agrada os dois, com missão e receita.</li></ol>');
  $("#dDay",pe).onclick=()=>{S.dayOffset=(S.dayOffset||0)+1;S.special=0;save();K.render("perfil");toast("Dia +"+S.dayOffset+": conteúdo novo nos poderes")};
  $("#dXp",pe).onclick=()=>{gain(100,0);K.render("perfil")};
  $("#dWid",pe).onclick=()=>{S.widget=false;save();widgetSheet()};
  $("#dWit",pe).onclick=()=>{S.vit=38;save();K.render("perfil");toast("Vitalidade caiu para 38%")};
  $("#dBon",pe).onclick=()=>{INVITE.mode=INVITE.mode==="price"?"week":"price";K.render("perfil");toast("Bônus configurado")}};

K.boot();
})();
