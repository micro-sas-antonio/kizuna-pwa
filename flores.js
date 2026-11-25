/* Flores em SVG - cada especie tem o seu desenho. Gerado a partir do v1. */
window.KZFlowers=(function(){
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const f=n=>Math.round(n*10)/10;
  const OPEN={dawn:1,day:1,dusk:.68,night:.28};
  let defs="";

  /* ---- formas de pétala (apontam para cima a partir de 0,0) ---- */
  function pd(sh,w,h){
    if(sh==="point")return "M0 0C"+f(-w)+" "+f(-h*.3)+" "+f(-w*.7)+" "+f(-h*.78)+" 0 "+f(-h)+"C"+f(w*.7)+" "+f(-h*.78)+" "+f(w)+" "+f(-h*.3)+" 0 0Z";
    if(sh==="notch")return "M0 0C"+f(-w*1.1)+" "+f(-h*.25)+" "+f(-w*1.05)+" "+f(-h*.92)+" "+f(-w*.28)+" "+f(-h)+"L0 "+f(-h*.84)+"L"+f(w*.28)+" "+f(-h)+"C"+f(w*1.05)+" "+f(-h*.92)+" "+f(w*1.1)+" "+f(-h*.25)+" 0 0Z";
    return "M0 0C"+f(-w*1.1)+" "+f(-h*.2)+" "+f(-w*1.1)+" "+f(-h*.98)+" 0 "+f(-h)+"C"+f(w*1.1)+" "+f(-h*.98)+" "+f(w*1.1)+" "+f(-h*.2)+" 0 0Z";
  }
  const G=(id,c0,c1,c2)=>{defs+='<linearGradient id="'+id+'" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="'+c0+'"/>'+(c2?'<stop offset=".55" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/>':'<stop offset="1" stop-color="'+c1+'"/>')+'</linearGradient>';return "url(#"+id+")"};
  const vein=h=>'<path d="M0 '+f(-h*.14)+'L0 '+f(-h*.72)+'" stroke="#fff" stroke-opacity=".32" stroke-width=".9" fill="none" stroke-linecap="round"/>';
  const raw=(d,fill,a,o)=>{o=o||{};return '<g class="pt" style="--a:'+(a||0)+'deg;--r:'+(o.r||0)+'px"><path d="'+d+'" fill="'+fill+'" stroke="#fff" stroke-opacity="'+(o.so===undefined?.5:o.so)+'" stroke-width=".9"/>'+(o.h?vein(o.h):"")+(o.rim?'<path d="M'+f(-o.rim[0]*.75)+' '+f(-o.rim[1]*.86)+'Q0 '+f(-o.rim[1]*1.1)+' '+f(o.rim[0]*.75)+' '+f(-o.rim[1]*.86)+'" fill="none" stroke="#ffd0d8" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/>':"")+'</g>'};
  const pet=(sh,w,h,a,fill,o)=>{o=o||{};return raw(pd(sh,w,h),fill,a,{r:o.r,so:o.so,h:o.vein===false?0:h,rim:o.rim?[w,h]:0})};
  const ring=(n,sh,w,h,fill,o)=>{o=o||{};let s="";for(let i=0;i<n;i++)s+=pet(sh,w,h,f((o.a0||0)+i*360/n),fill,o);return s};
  const dot=(x,y,r,c)=>'<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+r+'" fill="'+c+'"/>';
  const stem=(d,w,c)=>'<path d="'+d+'" stroke="'+(c||"#5a9a62")+'" stroke-width="'+(w||5)+'" fill="none" stroke-linecap="round"/>';
  const lf=(x,y,r,s,fl)=>'<g transform="translate('+x+' '+y+') rotate('+r+') scale('+(fl?-s:s)+' '+s+')"><path d="M0 0C-24 -6 -40 -24 -42 -48C-20 -44 -4 -28 0 0Z" fill="url(#gleaf)" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/><path d="M0 0C-10 -14 -22 -30 -38 -44" stroke="#fff" stroke-opacity=".35" stroke-width=".9" fill="none"/></g>';
  const spot=(x,y,s,inner)=>'<g transform="translate('+x+' '+y+') scale('+s+')">'+inner+'</g>';
  const plant=(under,head,hx,hy,sc,sy)=>'<g class="plant">'+under+(head?'<g transform="translate('+hx+' '+hy+') scale('+(sc||1)+' '+((sy||sc)||1)+')"><g class="head">'+head+'</g></g>':'')+'</g>';
  const POT='<g transform="translate(150 262)"><path d="M-50 -2H50L40 58Q38 66 30 66H-30Q-38 66 -40 58Z" fill="url(#gpot)"/><rect x="-56" y="-12" width="112" height="16" rx="8" fill="url(#gpot2)"/></g>';
  const GLOBAL='<linearGradient id="gleaf" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#3f8a52"/><stop offset="1" stop-color="#86c795"/></linearGradient><linearGradient id="gpot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a65770"/><stop offset="1" stop-color="#6a2a42"/></linearGradient><linearGradient id="gpot2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c47890"/><stop offset="1" stop-color="#8a3c56"/></linearGradient>';
  const STEM1="M150 262C147 215 154 160 150 112";

  /* ---- espécies ---- */
  const SP={
    rose(){
      const a=G("r1","#a8123a","#ea6784"),b=G("r2","#8c0f32","#d44463"),c=G("r3","#70092a","#b82a4c"),d=G("r4","#52081f","#8e1a3a");
      const head=ring(5,"round",30,48,a,{rim:1})+ring(5,"round",25,40,b,{a0:36,r:-2,rim:1})+ring(5,"round",19,31,c,{r:-3,rim:1})+ring(4,"round",12,20,d,{a0:20,r:-4,rim:1})+
        '<path d="M0 0c3-6 10-4 9 3c-1 8-14 8-16-2c-2-10 10-16 19-9" fill="none" stroke="#3a0614" stroke-opacity=".55" stroke-width="1.4" stroke-linecap="round"/>';
      return plant(stem(STEM1)+lf(150,222,-32,.95)+lf(152,186,34,.9,true),head,150,108,1);
    },
    orchid(){
      const a=G("o1","#e9b6d0","#fff6fa"),b=G("o2","#f2c6dc","#ffffff"),l=G("o3","#8a0f55","#d6308a");
      const bl=s=>'<g transform="scale('+s+')">'+pet("point",11,34,0,a)+pet("point",11,32,138,a)+pet("point",11,32,-138,a)+pet("round",20,32,74,b)+pet("round",20,32,-74,b)+pet("round",8,14,180,l,{vein:false})+dot(0,0,4,"#ffe08a")+'</g>';
      const under=lf(150,260,-64,1.5)+lf(150,260,64,1.5,true)+lf(148,260,-30,1.3)+lf(152,260,30,1.3,true)+stem("M150 262C146 200 150 150 168 118C176 104 186 96 198 90",3.5,"#7a9a52")+
        spot(160,132,1,bl(1))+spot(180,108,.85,bl(1))+spot(198,90,.7,bl(1))+dot(208,80,4,"#e8b0cc");
      return plant(under,"",0,0);
    },
    sakura(){
      const g=G("s1","#e8789f","#ffe3ec");
      const bl=s=>'<g transform="scale('+s+')">'+ring(5,"notch",11,19,g,{r:-2})+dot(0,0,2.6,"#f6c36a")+'</g>';
      const br=stem("M150 262C146 215 160 175 148 140",6,"#5a3a34")+stem("M152 200C185 190 205 165 214 140",4,"#5a3a34")+stem("M150 165C120 155 100 135 92 108",4,"#5a3a34")+stem("M148 140C150 118 160 100 172 86",4,"#5a3a34");
      const pts=[[214,136,1.3],[194,162,1.15],[92,106,1.3],[112,136,1.1],[172,84,1.2],[150,110,1.4],[188,110,1.1],[130,96,1.2],[206,112,1],[104,120,1]];
      return plant(br+pts.map(p=>spot(p[0],p[1],p[2],bl(1))).join(""),"",0,0);
    },
    lavender(){
      const cols=["#8d72d6","#a58be6","#6f56c0"];let sp="";
      for(let i=-3;i<=3;i++){let s=stem("M150 262L150 "+(112+Math.abs(i)*8),3,"#7a9a62");
        for(let j=0;j<9;j++){const y=112+Math.abs(i)*8+j*7,x=150+(j%2?4:-4);s+='<ellipse cx="'+x+'" cy="'+y+'" rx="4.2" ry="7" fill="'+cols[(j+i+3)%3]+'" transform="rotate('+(j%2?20:-20)+' '+x+' '+y+')"/>'}
        sp+='<g class="spk" style="--d:'+i*2.2+'deg"><g transform="rotate('+i*7+' 150 262)">'+s+'</g></g>'}
      return plant(lf(150,258,-70,1)+lf(150,258,70,1,true)+sp,"",0,0);
    },
    sunflower(){
      const a=G("f1","#d98a00","#ffd62a"),b=G("f2","#e8a000","#ffe35a");
      defs+='<radialGradient id="fd" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#3a2210"/><stop offset="1" stop-color="#6b4416"/></radialGradient>';
      let seeds="";for(let i=0;i<80;i++){const r=2.7*Math.sqrt(i),t=i*2.39996;seeds+=dot(r*Math.cos(t),r*Math.sin(t),1.5,i%3?"#c98a3a":"#8a5a1a")}
      const head=ring(20,"point",8,44,a,{r:-14})+ring(20,"point",8,40,b,{a0:9,r:-14})+'<circle r="27" fill="url(#fd)"/>'+seeds;
      return plant(stem("M150 262C148 215 154 160 150 112",6)+lf(150,226,-48,1.25)+lf(152,190,50,1.2,true),head,150,100,.95);
    },
    golden_jasmine(){
      const g=G("j1","#d9a520","#fff0a8");
      const bl=s=>'<g transform="scale('+s+')">'+ring(5,"point",7,18,g,{r:-1})+dot(0,0,2.4,"#fff3c4")+'</g>';
      const br=stem("M150 262C148 215 156 170 150 128",5)+stem("M152 200C180 190 200 170 208 142",3.5)+stem("M150 170C124 160 104 142 96 116",3.5)+stem("M150 128C152 110 162 98 172 88",3.5);
      const pts=[[208,140,1.3],[186,166,1.1],[96,114,1.3],[118,140,1.1],[172,86,1.2],[150,120,1.4],[130,100,1.1],[196,112,1]];
      return plant(br+lf(150,230,-40,.8)+lf(152,200,40,.8,true)+pts.map(p=>spot(p[0],p[1],p[2],bl(1))).join(""),"",0,0);
    },
    tulip(){
      const a=G("t1","#f0c24e","#e04a62","#c42a4e");
      const mid=raw("M-22 0C-30 -34 -22 -62 0 -86C22 -62 30 -34 22 0C10 8 -10 8 -22 0Z",a,0,{so:.45});
      const l=raw("M-22 0C-38 -30 -32 -68 -8 -86C-14 -56 -10 -24 6 4Z",a,0,{so:.4}),r=raw("M22 0C38 -30 32 -68 8 -86C14 -56 10 -24 -6 4Z",a,0,{so:.4});
      const under=stem("M150 262C149 215 151 165 150 118",5)+'<path d="M150 262C120 230 112 190 120 148C136 190 146 226 150 262Z" fill="url(#gleaf)"/><path d="M150 262C180 230 188 190 180 148C164 190 154 226 150 262Z" fill="url(#gleaf)"/>';
      return plant(under,l+r+mid,150,122,.95);
    },
    imperial_lily(){
      const a=G("l1","#ffd37a","#f26a1b","#e84a0e");let st="";
      for(let i=0;i<6;i++){const t=i*60;st+='<g transform="rotate('+t+')"><path d="M0 -8L0 -30" stroke="#c8e6a0" stroke-width="1.6"/><ellipse cy="-33" rx="2.4" ry="4.5" fill="#7a2b00"/></g>'}
      const head=ring(6,"point",13,58,a,{r:-3})+st;
      return plant(stem("M150 262C148 215 152 165 150 114",6)+lf(150,230,-50,1)+lf(152,198,50,1,true)+lf(150,168,-40,.8),head,150,106,.95);
    },
    peony(){
      const a=G("p1","#f08cb4","#f7a8c6"),b=G("p2","#f6b6d2","#fde7ef"),c=G("p3","#f8c4da","#fff0f5"),d=G("p4","#fbd2e2","#fff7fa");
      let ct="";for(let i=0;i<12;i++){ct+=dot(Math.cos(i*.52)*5,Math.sin(i*.52)*5,1.6,"#f6c36a")}
      const head=ring(8,"round",26,40,a)+ring(8,"round",22,34,b,{a0:22,r:-2})+ring(7,"round",18,26,c,{a0:10,r:-3})+ring(6,"round",12,18,d,{a0:30,r:-3})+ct;
      return plant(stem("M150 262C148 215 152 165 150 118",6)+lf(150,230,-55,1.2)+lf(152,198,55,1.15,true)+lf(150,166,-38,.9),head,150,112,1);
    },
    hibiscus(){
      const a=G("h1","#6b0012","#e8283c","#ff6a5a");
      const head='<g transform="rotate(-10)">'+ring(5,"round",34,52,a,{r:-4})+'<circle r="9" fill="#4a000c"/><path d="M0 0L18 -46" stroke="#f2c14e" stroke-width="3" stroke-linecap="round"/>'+dot(18,-46,3.5,"#c01030")+dot(14,-38,2,"#ffe08a")+dot(10,-30,2,"#ffe08a")+dot(21,-40,2,"#ffe08a")+'</g>';
      return plant(stem("M150 262C148 215 152 170 150 122",6)+lf(150,226,-55,1.1)+lf(152,196,55,1.1,true)+lf(150,170,-35,.85),head,150,112,.95);
    },
    midnight_lotus(){
      const a=G("m1","#fff2fa","#c58cff"),b=G("m2","#fff2fa","#e86ab6"),c=G("m3","#ffe6f4","#b26bff");
      defs+='<radialGradient id="mw" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#2a4070"/><stop offset="1" stop-color="#101a38"/></radialGradient>';
      const under='<ellipse cx="150" cy="232" rx="118" ry="30" fill="url(#mw)" opacity=".85"/><ellipse cx="96" cy="238" rx="40" ry="11" fill="#2f6b45"/><ellipse cx="214" cy="234" rx="34" ry="9" fill="#2f6b45"/><ellipse cx="150" cy="230" rx="26" ry="7" fill="#fff" opacity=".12"/>';
      const head=ring(10,"point",14,52,a)+ring(9,"point",13,44,b,{a0:20,r:-2})+ring(8,"point",11,36,c,{a0:10,r:-3})+'<circle r="8" fill="#f2d264"/>';
      return plant(under,head,150,204,1.15,.62);
    }
  };
  const NOPOT={midnight_lotus:1};

  function svg(k){defs="";const body=SP[k]?SP[k]():SP.rose();
    return '<svg viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(NAMES[k])+'"><defs>'+GLOBAL+defs+'</defs>'+body+(NOPOT[k]?"":POT)+'</svg>'}
const NAMES={rose:"Rosa",orchid:"Orquídea",sakura:"Sakura",lavender:"Lavanda",sunflower:"Girassol",golden_jasmine:"Jasmim",tulip:"Tulipa",imperial_lily:"Lírio",peony:"Peônia",hibiscus:"Hibisco",midnight_lotus:"Lótus"};
return {svg:k=>svg(SP[k]?k:"rose"),has:k=>!!SP[k]};
})();
