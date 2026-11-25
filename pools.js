/* Textos diarios reaproveitados do v1 */
const LOVE=["Eu te amo","Te adoro","Eu te admiro","Que sorte a minha ter você","Você é o meu lugar favorito","Ainda bem que você existe","Sou muito feliz com você","Você me faz bem","Meu coração é seu","Penso em você o dia todo"];
const ORCHID=[
 {t:"Escuta sem solução",b:"Pergunte: “Qual foi a melhor parte do seu dia?” Só escute, sem dar conselho. Depois conte a sua."},
 {t:"Lado a lado",b:"Sentem juntos por 5 minutos, sem telas, e conversem sobre qualquer coisa que não seja trabalho."},
 {t:"Reparei em você",b:"Conte uma coisa pequena que seu amor fez esta semana e que você notou e gostou."},
 {t:"Abraço de 10 segundos",b:"Ao se encontrarem hoje, abracem por 10 segundos inteiros antes de falar do dia."},
 {t:"Como facilito o seu dia?",b:"Pergunte: “O que eu posso fazer amanhã para deixar o seu dia mais leve?” E faça."},
 {t:"Olhos nos olhos",b:"Um minuto olhando um para o outro em silêncio. Quando alguém rir, o exercício deu certo."},
 {t:"Preocupação pequena",b:"Cada um conta uma preocupação pequena de hoje. Quem escuta responde só: “Faz sentido.”"},
 {t:"Foto-lembrança",b:"Mande agora uma foto de algo que lembrou do seu amor hoje, com uma frase de uma linha."}
];
const SAKURA=[
 {t:"Chá em silêncio",d:"Preparem um chá e bebam juntos, sem falar, por 5 minutos. Sintam o calor da xícara.",steps:["Aqueçam a água sem pressa.","Sirvam um para o outro.","Bebam em silêncio, prestando atenção ao sabor."]},
 {t:"Caminhada da flor",d:"Dez minutos de caminhada lenta, de mãos dadas, procurando três cores bonitas pelo caminho.",steps:["Guardem o celular no bolso.","Cada um aponta uma cor que achou bonita.","Voltem comentando qual foi a favorita."]},
 {t:"Carta de três linhas",d:"Escrevam, cada um, três linhas de gratidão pelo outro e troquem sem ler na hora.",steps:["Uma coisa que o outro fez por você.","Uma qualidade que você admira.","Uma coisa que você quer viver junto."]},
 {t:"Escuta do ambiente",d:"Fechem os olhos por 2 minutos e escutem todos os sons da casa e da rua.",steps:["Sentem de frente, joelhos se tocando.","Respirem fundo três vezes.","Contem quantos sons cada um percebeu."]},
 {t:"Alongamento costas com costas",d:"Sentem de costas um para o outro e alonguem juntos, sentindo a respiração do outro.",steps:["Apoiem as costas, ombros relaxados.","Inspirem e expirem no mesmo ritmo.","Inclinem devagar para um lado e depois para o outro."]},
 {t:"Cerimônia da luz",d:"Apaguem as luzes, acendam uma vela e cada um diz uma coisa boa do dia.",steps:["Escolham um lugar firme para a vela.","Cada um fala uma coisa boa de hoje.","Apaguem a vela juntos."]},
 {t:"Respiração sincronizada",d:"Respirem juntos no ritmo 4-4-6 por cinco ciclos, olhando a flor crescer.",steps:["Inspire contando 4.","Segure contando 4.","Solte contando 6."]},
 {t:"Origami do dia",d:"Dobrem um coraçãozinho de papel e escondam com um bilhete para o outro achar.",steps:["Peguem um papel quadrado.","Dobrem seguindo um tutorial curto.","Escrevam uma frase dentro e escondam."]}
];
const LAVENDER=[
 {t:"Têmporas e testa",d:"Três minutos de massagem em círculos lentos nas têmporas e na testa, com a luz baixa."},
 {t:"Nuca e ombros",d:"Com um pouco de óleo morno, desça da nuca aos ombros com movimentos longos e lentos."},
 {t:"Mãos e antebraços",d:"Massageiem as mãos um do outro, polegar por polegar, e subam até o antebraço."},
 {t:"Escalda-pés e pés",d:"Escalda-pés morno por 5 minutos e depois massagem na sola, dos calcanhares aos dedos."},
 {t:"Costas com polegares",d:"Com os polegares, trabalhem ao lado da coluna, de baixo para cima. Nunca sobre a coluna."},
 {t:"Couro cabeludo",d:"Cafuné firme e lento por 5 minutos. Quem recebe só precisa respirar."},
 {t:"Respiração 4-7-8",d:"Deitados, inspirem por 4, segurem por 7 e soltem por 8. Quatro ciclos já ajudam a dormir."},
 {t:"Quarto de sono",d:"Luz amarela fraca, quarto fresco, celular longe da cama e uma música suave por 10 minutos."}
];
const SUN=[
 {t:"Dança de uma música",b:"Escolham uma música animada e dancem até o fim. Vale fazer careta."},
 {t:"Elogio relâmpago",b:"Em 30 segundos, cada um diz cinco coisas que admira no outro."},
 {t:"Dez agachamentos juntos",b:"Dez agachamentos de mãos dadas. Quem errar a contagem paga um beijo."},
 {t:"Caminhada de 15 minutos",b:"Saiam para o sol por 15 minutos, sem destino e sem celular."},
 {t:"Tarefa surpresa",b:"Faça hoje uma tarefa da casa que normalmente é do outro, sem avisar."},
 {t:"Selfie sorrindo",b:"Tirem uma foto fazendo a mesma pose engraçada e guardem no álbum do casal."},
 {t:"Café da manhã diferente",b:"Preparem algo que nunca fizeram juntos, mesmo que seja simples."},
 {t:"Treino de 5 minutos",b:"Cinco minutos de alongamento ou exercício leve, um guiando o outro."}
];
const PRIZES=["Jantar à luz de velas em casa","Vale-massagem de 15 minutos","Você escolhe o filme e o outro não reclama","Café da manhã na cama amanhã","Banho a dois com música","Um desejo pequeno realizado","Noite sem celular","Passeio surpresa no fim de semana"];
const TULIP=[
 "Qual lembrança nossa faz você sorrir sempre?","O que você ainda quer viver comigo neste ano?","Quando foi que você percebeu que estava apaixonado(a)?","Qual pequeno hábito meu você acha mais fofo?",
 "Se pudéssemos viajar amanhã, para onde iríamos?","O que eu faço que faz você se sentir mais cuidado(a)?","Qual música é a nossa e por quê?","O que você gostaria que eu soubesse e nunca disse?"];
const LILY=[
 {t:"Jantar de olhos vendados",b:"Um vendado, o outro oferece pequenas porções para adivinhar. Depois trocam."},
 {t:"Dança lenta no escuro",b:"Luzes apagadas, uma música suave e os dois dançando bem juntinhos por 4 minutos."},
 {t:"Carta de desejos",b:"Cada um escreve três desejos para a noite. O outro escolhe um e cumpre."},
 {t:"Massagem com contagem",b:"Dez minutos de massagem para cada um, com o relógio, sem falar nada."},
 {t:"Banho de espuma e vela",b:"Banho a dois com espuma, uma vela e a playlist favorita do casal."},
 {t:"Piquenique de quarto",b:"Uma toalha no chão, petiscos e uma garrafa de algo especial, como se fosse um encontro."},
 {t:"Perguntas na penumbra",b:"Cada um faz três perguntas íntimas. Vale responder “passo”."},
 {t:"Surpresa de bilhete",b:"Escondam bilhetes pela casa com dicas até o lugar da noite."}
];
const PEONY=[
 "Contem como foi o primeiro encontro, cada um do seu ponto de vista.","Qual foi a viagem ou passeio que mais marcou vocês?","Lembrem uma risada que quase não deixou vocês respirarem.","Qual foi a primeira música que vocês dançaram juntos?",
 "Qual foi o momento difícil que vocês superaram juntos?","Qual foi a primeira impressão que cada um teve do outro?","Qual foi o melhor presente que já deram um ao outro?","Revejam uma foto antiga e contem o que não está nela."];
const ADVENT=[
 {t:"Piquenique na sala",b:"Estendam uma toalha no chão, com petiscos e música, como se estivessem num parque."},
 {t:"Passeio sem destino",b:"Peguem a primeira rua à direita e vejam onde vão parar. Sem mapa."},
 {t:"Noite de jogo",b:"Escolham um jogo de tabuleiro ou cartas. O perdedor faz a massagem."},
 {t:"Cozinhar algo novo",b:"Sorteiem uma receita de outro país e preparem juntos."},
 {t:"Cinema em casa",b:"Montem uma sessão com pipoca, cobertor e luz apagada, como se fosse sala de cinema."},
 {t:"Fotos de bairro",b:"Passeiem fotografando detalhes bonitos do bairro e montem um mini álbum."},
 {t:"Pôr do sol a dois",b:"Procurem um lugar alto para ver o pôr do sol e levem algo quente para beber."},
 {t:"Tarde de cafeteria",b:"Escolham uma cafeteria que nenhum dos dois conhece e experimentem o prato da casa."}
];
const SPECIAL=[
 "Eu escolhi você hoje, de novo. E escolheria amanhã.","Você deixa o meu dia mais leve só por existir.","Obrigado por cuidar de mim do seu jeito.","Se hoje foi difícil, saiba que eu estou do seu lado.",
 "Tem um canto do meu coração que só você conhece.","Eu me sinto em casa quando estou com você.","Qualquer lugar fica melhor com você ao lado.","Você é a melhor parte dos meus dias."];
const HOT=[
 {t:"Massagem sensorial de 10 min",d:"Um deita e o outro massageia costas e braços com óleo morno, sem pressa. Depois, troquem. Sem pressão para ir além.",p:["Óleo Térmico Corporal VŌLVA","Aquece de leve e desliza bem."]},
 {t:"Jogo das três perguntas",d:"Cada um faz três perguntas sensuais ao outro. Vale responder “passo” sem explicar.",p:["Kit Descoberta Sensorial VŌLVA","Para variar a rotina com novas texturas e aromas."]},
 {t:"Dança lenta à luz de velas",d:"Apaguem a luz forte, acendam uma vela e dancem bem juntinhos, no ritmo da respiração.",p:["Vela Aromática de Massagem VŌLVA","Vira óleo morno depois de acesa."]},
 {t:"Bilhete escondido",d:"Escondam um bilhete com um desejo para o outro achar até o fim da noite.",p:["Óleo Beijável Sensorial VŌLVA","Aroma suave para um momento a dois."]},
 {t:"Banho a dois",d:"Banho morno com música baixa, e cada um lava o cabelo do outro, devagar.",p:["Kit Spa Noturno VŌLVA","Sais e óleo para o banho."]},
 {t:"Beijos sem pressa",d:"Cinco minutos só de beijos, sem ir além, sem celular. O relógio é o limite.",p:["Óleo Beijável Sensorial VŌLVA","Aroma suave para um momento a dois."]},
 {t:"Toque às cegas",d:"Um fecha os olhos e adivinha o que toca a pele: pena, tecido, óleo morno.",p:["Kit Descoberta Sensorial VŌLVA","Para variar a rotina com novas texturas e aromas."]},
 {t:"Playlist da noite",d:"Montem juntos uma playlist só para hoje. Cada um escolhe cinco músicas e escondem as do outro até tocar.",p:["Vela Aromática de Massagem VŌLVA","Clima certo para ouvir tudo."]}
];
