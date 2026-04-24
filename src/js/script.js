const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let jogador = {
    x: 50,
    y: 50,
    w: 50,
    h: 50,
    s: 5
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "blue";
    ctx.fillRect(jogador.x, jogador.y, jogador.w, jogador.h);
};

function update() {
    if (jogador.x < 240) {
      jogador.x += jogador.s;
    } else if (jogador.x >= 240 && jogador.y < 240) {
      jogador.y += jogador.s;
    }
    
};

function loop() {
    draw();
    update();

    requestAnimationFrame(loop);
};

loop();