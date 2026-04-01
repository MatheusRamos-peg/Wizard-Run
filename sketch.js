// 1. VARIÁVEIS
var jogador, anim_correr, anim_pulo;
var chao, img_chao, img_fundo; 
var inimigo, anim_inimigo;
var grupoTiros, anim_tiro;
var montanha, img_montanha;

var placar = 0;
var statusJogo = "JOGANDO";

function preload() {
  anim_correr = loadAnimation("assets/sprite_0.png", "assets/sprite_1.png", "assets/sprite_2.png");
  anim_pulo = loadAnimation("assets/jumpbagn.png");
  img_chao = loadAnimation("assets/ground.png");
  img_fundo = loadImage("assets/backGround.png"); 
  img_montanha = loadAnimation("assets/mountain.png"); 
  anim_inimigo = loadAnimation("assets/enemy1.png", "assets/enemy1Animation.png", "assets/enemy1Animation2.png");
  anim_tiro = loadAnimation("assets/projectile_1.png", "assets/projectile_2.png", "assets/projectile_3.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // IMPORTANTE: A ordem de criação aqui define as camadas iniciais
  
  // A montanha é criada primeiro para ficar atrás
  montanha = createSprite(width + 200, height - 125) 
  montanha.addAnimation("fundo", img_montanha);
  montanha.velocityX = -2; 
  montanha.scale = 1.8;

  chao = createSprite(width / 2, height - 50);
  chao.addAnimation("asfalto", img_chao);
  chao.scale = 2;
  chao.velocityX = -3;

  jogador = createSprite(150, height - 150, 50, 50); 
  jogador.addAnimation("correndo", anim_correr);
  jogador.addAnimation("pulando", anim_pulo);
  jogador.scale = 0.8;
  jogador.setCollider("rectangle", 0, 0, 40, 90);

  inimigo = createSprite(width + 100, height - 150, 50, 50);
  inimigo.addAnimation("ataque", anim_inimigo);
  inimigo.velocityX = -20; 
  inimigo.scale = 0.3;
  inimigo.setCollider("rectangle", 0, 0, 150, 250);

  grupoTiros = new Group();
}

function draw() {
  background(img_fundo); 

  if (statusJogo === "JOGANDO") {
    
    jogador.velocityY = jogador.velocityY + 0.8;

    if (jogador.collide(chao)) {
      jogador.changeAnimation("correndo");
      if (keyDown("space")) {
        jogador.velocityY = -18;
        jogador.changeAnimation("pulando");
      }
    }

    inimigo.collide(chao);

    if (keyWentDown("f")) {
      criarTiro();
    }

    if (grupoTiros.isTouching(inimigo)) {
      inimigo.x = width + random(200, 600);
      grupoTiros.destroyEach();
      placar = placar + 10;
    }

    if (inimigo.isTouching(jogador)) {
      statusJogo = "GAMEOVER";
    }

    // MANUTENÇÃO DO LOOP (Cenário infinito)
    if (chao.x < width / 4) chao.x = width / 2;
    
    // Faz a montanha voltar para a direita quando sai da tela à esquerda
    if (montanha.x < -300) {
      montanha.x = width + 400;
    }

    if (inimigo.x < -50) {
      inimigo.x = width + random(200, 600);
      placar = placar + 1;
    }

    drawSprites();

    fill("white");
    textSize(30);
    text("Pontos: " + placar, 50, 50);

  } 
  else if (statusJogo === "GAMEOVER") {
    background(0, 180);
    textAlign(CENTER);
    fill("red");
    textSize(60);
    text("GAME OVER", width / 2, height / 2 - 20);
    fill("white");
    text("Pontuação: " + placar, width / 2, height / 2 + 40);
    textSize(20);
    text("Pressione 'R' para reiniciar", width / 2, height / 2 + 100);

    if (keyDown("r")) {
      resetar();
    }
  }
}

function criarTiro() {
  var tiro = createSprite(jogador.x + 50, jogador.y, 20, 10);
  tiro.addAnimation("bala", anim_tiro);
  tiro.velocityX = 12;
  tiro.scale = 0.5;
  tiro.lifetime = 150; 
  grupoTiros.add(tiro);
}

function resetar() {
  statusJogo = "JOGANDO";
  placar = 0;
  
  // RESET DA MONTANHA: Volta para a posição inicial à direita
  montanha.x = width + 200;
  montanha.velocityX = -2;

  // RESET DOS OUTROS ELEMENTOS
  inimigo.x = width + 100;
  jogador.y = height - 150;
  jogador.velocityY = 0;
  chao.velocityX = -3;
  
  grupoTiros.destroyEach();
} 