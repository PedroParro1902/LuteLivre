const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let attackCooldown = 0;
let imagesLoaded = 0;

let playerImg = new Image();
playerImg.src = "src/images/player.png"

let enemyImg = new Image();
enemyImg.src = "src/images/enemy.png"

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
    grounded: false
};

let enemy = {
    x: 550,
    y: 50,
    width: 50,
    height: 50,
    vx: 0,
    vy: 0,
    gravity: 0.5,
    life: 100,
}

let chao = {
    x: 0,
    y: canvas.height / 2,
    width: canvas.width,
    height: 200
};

let keys = {};

document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Chão
    ctx.fillStyle = "gray";
    ctx.fillRect(chao.x, chao.y, chao.width, chao.height);

    //Player
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    //Inimigo
    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
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
    enemy.vy = enemy.vy || 0;
    enemy.vy += enemy.gravity;
    enemy.y += enemy.vy;

    //Colisão com chão Player
    if (
        player.y + player.height >= chao.y &&
        player.y + player.height <= chao.y + chao.height &&
        player.vy >= 0
    ) {
        player.y = chao.y - player.height;
        player.vy = 0;
        player.grounded = true;
    } else {
        player.grounded = false;
    }

    //Colisão com o chão Enemy
    if (enemy.y + enemy.height >= chao.y) {
        enemy.y = chao.y - enemy.height;
        enemy.vy = 0;
    }

    //Cooldown
    if (attackCooldown > 0) attackCooldown--;

    //Ataque
    if (keys["KeyK"] && attackCooldown === 0) {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            enemy.life -= 1;
            console.log("Acertou", enemy.life);
            attackCooldown = 20;
        }
    }
};

function loop() {
    update();
    draw();

    requestAnimationFrame(loop);
};

function checkStart() {
    imagesLoaded++;
    if (imagesLoaded === 2) loop()
}

playerImg.onload = checkStart;
enemyImg.onload = checkStart;