// Gera roletas.js a partir de roletas.json (edite SO o roletas.json). Uso: node tools/gerar-roletas.js
const fs=require("fs");
const j=JSON.parse(fs.readFileSync(__dirname+"/../roletas.json","utf8"));
fs.writeFileSync(__dirname+"/../roletas.js","/* GERADO de roletas.json - nao edite aqui. Rode: node tools/gerar-roletas.js */\nwindow.KZ_ROLETAS="+JSON.stringify(j)+";\n");
console.log("roletas.js gerado:",j.slim.length,"slim,",j.hot.length,"hot, semana",j.semana);
