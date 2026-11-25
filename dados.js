/* Catalogo de series, filmes e animes (g = generos) e dicas do ciclo */
window.KZ_GENEROS=[["romance","Romance"],["comedia","Comédia"],["acao","Ação"],["suspense","Suspense"],["terror","Terror"],["fantasia","Fantasia"],["ficcao","Ficção"],["drama","Drama"],["crime","Crime"],["aventura","Aventura"],["culinaria","Culinária"]];
const M=(t,g)=>({t,g:g.split(" ")});
window.KZ_MEDIA={
 serie:[
  M("Bridgerton","romance drama"),M("Outlander","romance fantasia aventura"),M("Normal People","romance drama"),M("Heartstopper","romance comedia"),
  M("Emily em Paris","romance comedia"),M("Bon Appétit, Vossa Majestade","romance culinaria comedia"),M("Pousando no Amor","romance comedia drama"),
  M("Ginny & Georgia","drama comedia"),M("O Urso (The Bear)","culinaria drama"),M("Round 6","suspense acao drama"),M("Stranger Things","ficcao terror aventura"),
  M("Wandinha","suspense comedia fantasia"),M("La Casa de Papel","crime acao suspense"),M("Breaking Bad","crime drama suspense"),M("Peaky Blinders","crime drama acao"),
  M("The Witcher","fantasia acao aventura"),M("Game of Thrones","fantasia drama acao"),M("Black Mirror","ficcao suspense"),M("Dark","ficcao suspense drama"),
  M("You","suspense crime romance"),M("Lucifer","comedia crime fantasia"),M("Brooklyn Nine-Nine","comedia crime"),M("Friends","comedia romance"),
  M("How I Met Your Mother","comedia romance"),M("The Office","comedia"),M("Modern Family","comedia"),M("Chef's Table","culinaria"),
  M("Fleabag","comedia drama"),M("This Is Us","drama romance"),M("Sex Education","comedia drama romance"),M("The Mandalorian","ficcao aventura acao"),
  M("Arcane","acao fantasia drama"),M("Sherlock","crime suspense"),M("A Maldição da Residência Hill","terror drama"),M("The Last of Us","terror drama acao"),
  M("Gilmore Girls","comedia drama romance"),M("Outer Banks","aventura acao romance"),M("Lupin","crime aventura"),M("Cobra Kai","acao comedia drama"),
  M("Ted Lasso","comedia drama"),M("Loki","ficcao fantasia aventura"),M("Sobrenatural (Supernatural)","terror fantasia aventura"),M("Reacher","acao crime suspense"),
  M("Maid","drama"),M("Anne with an E","drama romance aventura"),M("The Great British Bake Off","culinaria comedia"),M("Julia","culinaria drama comedia")
 ],
 filme:[
  M("Questão de Tempo","romance fantasia comedia"),M("Diário de uma Paixão","romance drama"),M("La La Land","romance drama"),M("Orgulho e Preconceito","romance drama"),
  M("Como Eu Era Antes de Você","romance drama"),M("Simplesmente Acontece","romance comedia"),M("Mamma Mia!","romance comedia"),M("A Culpa é das Estrelas","romance drama"),
  M("Titanic","romance drama"),M("Ela (Her)","romance ficcao drama"),M("Brilho Eterno de uma Mente sem Lembranças","romance ficcao drama"),M("10 Coisas que Eu Odeio em Você","romance comedia"),
  M("Uma Linda Mulher","romance comedia"),M("Dirty Dancing","romance drama"),M("Chef","culinaria comedia drama"),M("Julie & Julia","culinaria comedia romance"),M("Ratatouille","culinaria comedia aventura"),
  M("Sr. e Sra. Smith","acao romance comedia"),M("John Wick","acao crime"),M("Mad Max: Estrada da Fúria","acao ficcao aventura"),M("Missão: Impossível","acao suspense"),
  M("Entre Facas e Segredos","suspense crime comedia"),M("Parasita","suspense drama comedia"),M("Garota Exemplar","suspense crime drama"),M("Seven: Os Sete Crimes Capitais","crime suspense"),
  M("Corra!","terror suspense"),M("Um Lugar Silencioso","terror suspense ficcao"),M("Invocação do Mal","terror"),M("Hereditário","terror drama"),M("Interestelar","ficcao drama aventura"),
  M("A Origem","ficcao acao suspense"),M("Matrix","ficcao acao"),M("O Senhor dos Anéis: A Sociedade do Anel","fantasia aventura acao"),M("Harry Potter e a Pedra Filosofal","fantasia aventura"),
  M("Pantera Negra","acao aventura ficcao"),M("Vingadores: Ultimato","acao ficcao aventura"),M("Se Beber, Não Case","comedia"),M("Penetras Bons de Bico","comedia romance"),M("Click","comedia drama fantasia"),
  M("Divertida Mente","comedia drama fantasia"),M("Up: Altas Aventuras","aventura drama comedia"),M("Coco","fantasia aventura drama"),M("Cidade de Deus","crime drama"),M("Que Horas Ela Volta?","drama comedia"),
  M("Tudo em Todo o Lugar ao Mesmo Tempo","ficcao comedia acao drama"),M("O Auto da Compadecida","comedia aventura"),M("Todo Mundo em Pânico","comedia terror"),
  M("Zumbilândia","comedia terror acao"),M("O Grande Hotel Budapeste","comedia aventura crime"),M("Coringa","crime drama suspense"),M("Meu Malvado Favorito","comedia aventura"),M("Bastardos Inglórios","acao crime drama")
 ],
 anime:[
  M("Spy x Family","acao comedia"),M("Food Wars!","culinaria comedia acao"),M("Your Name","romance fantasia drama"),M("Horimiya","romance comedia"),M("Frieren","fantasia aventura drama"),
  M("Violet Evergarden","drama romance fantasia"),M("Kaguya-sama: Love Is War","romance comedia"),M("Toradora!","romance comedia drama"),M("Death Note","suspense crime"),M("Attack on Titan","acao drama terror"),
  M("Demon Slayer","acao fantasia"),M("Jujutsu Kaisen","acao terror fantasia"),M("One Piece","aventura comedia acao"),M("Fullmetal Alchemist: Brotherhood","aventura fantasia drama"),M("Cowboy Bebop","ficcao acao crime"),
  M("Steins;Gate","ficcao suspense"),M("Fruits Basket","romance drama fantasia"),M("Dr. Stone","ficcao aventura comedia"),M("A Voz do Silêncio","romance drama"),M("O Serviço de Entregas da Kiki","fantasia aventura"),
  M("A Viagem de Chihiro","fantasia aventura"),M("Weathering With You","romance fantasia"),M("Chainsaw Man","acao terror"),M("Mob Psycho 100","comedia acao"),M("Delicious in Dungeon","culinaria fantasia aventura comedia"),
  M("Kimi ni Todoke","romance drama"),M("Solo Leveling","acao fantasia"),M("Haikyu!!","comedia drama acao"),M("Bleach","acao fantasia"),M("Naruto","acao aventura")
 ]
};

/* ============ CICLO: dicas para o parceiro, por fase ============ */
window.KZ_FASES={
 menstrual:{n:"Menstruação",ic:"🩸",cor:"#c2185b",sente:"Pode estar com cólica, cansaço e mais sensível. Colo e paciência valem ouro.",
  dias:{
   1:[{t:"Dia 1: dia de mimo quentinho",b:"Faça um chocolate quente, ou um bolo quentinho, ou uma sopa, ou peça uma pizza. Ou leve ela para comer num lugar diferente, sem pressa. Pergunte antes o que ela está com vontade."},
      {t:"Bolsa de água quente + colo",b:"Bolsa de água quente na barriga, cobertor, a série favorita dela e você por perto, sem cobrar nada."}],
   2:[{t:"Segundo dia, ainda pede carinho",b:"Chá de camomila ou gengibre, massagem leve nas costas e nos pés, e uma sobremesa de chocolate."}],
   3:[{t:"Ajude na casa hoje",b:"Assuma a louça e o jantar. Um gesto prático alivia mais que mil palavras."}]},
  geral:[{t:"Chocolate e chá",b:"Chocolate meio amargo, chá quente e uma frase sua: “Estou aqui, do que você precisa?”"},
         {t:"Massagem lombar",b:"Massagem leve e lenta na lombar e nos pés, com óleo morno, por 10 minutos."},
         {t:"Noite de filme e cobertor",b:"Deixe ela escolher o filme, leve petiscos e fique de conchinha. Sem pressão para mais nada."},
         {t:"Comida de conforto",b:"Pergunte qual é a comida de conforto dela e prepare ou peça hoje."}]},
 folicular:{n:"Fase folicular",ic:"🌱",cor:"#2f8a5b",sente:"A energia volta, o humor melhora e ela fica mais disposta e criativa.",
  geral:[{t:"Dia de programa novo",b:"Ela está com energia: chame para um passeio, um restaurante diferente ou uma atividade que vocês nunca fizeram."},
         {t:"Planejem algo juntos",b:"Ótima fase para planejar viagem, metas do casal ou aquela conversa sobre o futuro."},
         {t:"Movimento a dois",b:"Caminhada, dança, bicicleta ou treino juntos. Ela costuma aproveitar bem agora."},
         {t:"Elogie as ideias dela",b:"A criatividade está alta. Escute as ideias com atenção e apoie de verdade."}]},
 fertil:{n:"Fase fértil / ovulação",ic:"🌸",cor:"#1e88c9",sente:"Costuma estar mais confiante, sociável e com mais desejo.",
  geral:[{t:"Encontro especial",b:"Jantar romântico, roupa bonita e um elogio sincero logo na chegada."},
         {t:"Clima de conquista",b:"Flertem como no começo: bilhete, mensagem ousada com bom gosto, dança lenta na sala."},
         {t:"Saiam juntos",b:"Ela está sociável: chamem amigos ou saiam para dançar."},
         {t:"Atenção ao cuidado",b:"Se não querem engravidar agora, conversem e combinem o método de vocês. Este app dá só uma estimativa e não é método contraceptivo."}]},
 lutea:{n:"Fase lútea",ic:"🍂",cor:"#b7791f",sente:"A energia vai baixando e ela pede mais calma, rotina e aconchego.",
  geral:[{t:"Noite caseira",b:"Comida gostosa em casa, luz baixa, uma série boa e cobertor. Simples e perfeito."},
         {t:"Cozinhem juntos",b:"Escolham uma receita reconfortante e façam a dois."},
         {t:"Escute mais",b:"Pergunte como ela está e escute sem tentar resolver. Às vezes ela só precisa desabafar."},
         {t:"Massagem relaxante",b:"Massagem nos ombros e pés com óleo morno antes de dormir ajuda no sono."}]},
 tpm:{n:"TPM",ic:"🌧️",cor:"#7b1fa2",sente:"Humor mais oscilante, cansaço, vontade de doce e sensibilidade. Nada disso é falta de amor.",
  geral:[{t:"Doce sem comentário",b:"Traga o doce favorito dela e nenhum comentário. Só um abraço e “estou com você”."},
         {t:"Paciência de ouro",b:"Se ela estiver irritada, respire e não leve para o pessoal. Pergunte: “Quer colo ou quer espaço?”"},
         {t:"Cuide da rotina",b:"Assuma tarefas da casa e evite discussões de assuntos pesados nesses dias."},
         {t:"Chá e carinho",b:"Chá de camomila, banho morno, massagem nos pés e luz baixa."},
         {t:"Surpresa pequena",b:"Uma flor, um bilhete ou o lanche favorito dela mostram que você pensa nela."}]}
};
