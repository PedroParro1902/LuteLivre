const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Evento
let currentEvent = "workday";

//Tempo de Ataque
let attackCooldown = 0;

// Tempo de ataque inimigo
let enemyattackCooldown = 0;

// Imagens Carregadas
let imagesLoaded = 0;

// Vida Inimigo
let enemyAlive = true;

// Vida Jogador
let playerAlive = true

// Imagens
let playerImg = new Image();
playerImg.src = "src/images/player.png"
let enemyImg = new Image();
enemyImg.src = "src/images/enemy.png"
let fundoImg = new Image();
fundoImg.src = "src/images/fundo.png"
let chaoImg = new Image();
chaoImg.src = "src/images/chao.png"

// Jogador
let player = {
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    speed: 5,
    vx: 0,
    vy: 0,
    jump: -10,
    gravity: 0.5,
    grounded: false,
    life: 100,
};

//Inimigo
let enemy = {
    x: 500,
    y: 50,
    width: 50,
    height: 50,
    speed: 3,
    vx: 0,
    vy: 0,
    gravity: 0.5,
    life: 100,
}

// Chão
let chao = {
    x: 0,
    y: canvas.height / 2,
    width: canvas.width,
    height: 200
};

// Detector de Teclas
let keys = {};

document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Fundo
    ctx.drawImage(fundoImg, 0, 0, canvas.width, canvas.height);

    //Chão
    ctx.drawImage(chaoImg, chao.x, chao.y, chao.width, chao.height);

    //Player
    if (playerAlive) {
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    };

    //Inimigo
    if (enemyAlive) {
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    };

    // Texto
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Vida Inimigo: " + enemy.life, 50, 50)
};

function update() {
    //Movimento horizontal
    if (keys["KeyD" ]) player.vx = player.speed;
    else if (keys["KeyA"]) player.vx = -player.speed;
    else player.vx = 0;

    //Pulo
    if (keys["KeyW"] && player.grounded) {
        player.vy = player.jump;
        player.grounded = false;
    }

    //Gravidade Player
    player.vy += player.gravity
    player.x += player.vx;
    player.y += player.vy;

    //Gravidade Enemy
    enemy.vy += enemy.gravity;
    enemy.y += enemy.vy;

    //Colisão com chão Player
    if (
        player.y + player.height >= chao.y &&
        player.vy >= 0
    ) {
        player.y = chao.y - player.height;
        player.vy = 0;
        player.grounded = true;
    } else {
        player.grounded = false;
    }
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width)
        player.x = canvas.width - player.width;

    //Colisão com o chão Enemy
    if (enemy.y + enemy.height >= chao.y) {
        enemy.y = chao.y - enemy.height;
        enemy.vy = 0;
    }

    //Cooldown
    if (attackCooldown > 0) attackCooldown--;
    if (enemyattackCooldown > 0) enemyattackCooldown--;

    //Ataque do Jogador
    if (keys["KeyK"] && attackCooldown === 0) {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            enemy.life -= 5;
            console.log("Acertou! Vida:", enemy.life);
            attackCooldown = 20;
        }
    }

    // Ataque do inimigo
    if (playerAlive && enemyattackCooldown === 0) {
        if (
            enemy.x < player.x + player.width &&
            enemy.x + enemy.width > player.x &&
            enemy.y < player.y + player.height &&
            enemy.y + enemy.height > player.y
        ) {
            player.life -= 5;
            console.log("Sua Vida:", player.life);
            enemyattackCooldown = 30;
        }
    }

    // Morte do Inimigo
    if (enemy.life <= 0) {
        enemyAlive = false;
        console.log("Inimigo Derrotado!");
        enemy.x = -1000;
    }

    // Morte do Jogador
    if (player.life <= 0) {
        playerAlive = false;
        console.log("Você MORREU!");
        player.x = -1000;
    }

    //IA inimigo
    if (enemyAlive) {
        if (player.x < enemy.x) {
            enemy.x -= enemy.speed;
        } else if (player.x > enemy.x) {
            enemy.x  += enemy.speed;
        }
    }
};

function applyEvent() {
    if (currentEvent === "workday") {
        player.speed = 6;
        enemy.speed = 6;
    }
}

function loop() {
    applyEvent();
    update();
    draw();

    requestAnimationFrame(loop);
};

// Carregamento de Imagens
function checkStart() {
    imagesLoaded++;
    if (imagesLoaded === 4) loop()
}

playerImg.onload = checkStart;
enemyImg.onload = checkStart;
chaoImg.onload = checkStart;
fundoImg.onload = checkStart;