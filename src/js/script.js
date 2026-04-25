const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let playerImg = new Image();
playerImg.src = "src/images/player.png"

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

let chao = {
    x: 0,
    y: canvas.height / 2,
    width: canvas.width,
    height: 50
};

let keys = {};

document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //Chão
    ctx.fillStyle = "red";
    ctx.fillRect(chao.x, chao.y, chao.width, chao.height)

    //Player
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height)
};

function update() {
    //Movimento horizontal
    if (keys["ArrowRight" ]) player.vx = player.speed;
    else if (keys["ArrowLeft"]) player.vx = -player.speed;
    else player.vx = 0;

    //Pulo
    if (keys["Space"] && player.grounded) {
        player.vy = player.jump;
        player.grounded = false;
    }

    //Gravidade
    player.vy += player.gravity;

    //Atualizar posição
    player.x += player.vx;
    player.y += player.vy;

    //Colisão com chão
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
};

function loop() {
    update();
    draw();

    requestAnimationFrame(loop);
};

playerImg.onload = () => {
    loop();
};