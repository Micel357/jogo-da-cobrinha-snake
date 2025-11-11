// game.js
// Snake Game básico em JS com canvas
// Feito no estilo "rapaz universitário" cheio de comentários pra se achar depois haha

// Pega o canvas e o contexto 2D (onde vamos desenhar tudo)
let canvas = document.getElementById("gc");
let ctx = canvas.getContext("2d");

// Variáveis iniciais do jogo
let tamanho = 20;          // Tamanho de cada bloquinho (cobra e comida)
let quantidade = 20;       // Quantos bloquinhos cabem (400px/20px = 20)
let posX = 10, posY = 10;  // Posição inicial da cobra (meio do mapa)
let velocidadeX = 0, velocidadeY = 0; // Movimento inicial (parado)
let rastro = [];           // Guarda as posições do corpo da cobra
let cauda = 5;             // Tamanho inicial da cobra

// Posição da comida
let comidaX = Math.floor(Math.random() * quantidade);
let comidaY = Math.floor(Math.random() * quantidade);

// Função principal que roda várias vezes por segundo
function game() {
    posX += velocidadeX;
    posY += velocidadeY;

    // Faz a cobra atravessar a parede e aparecer do outro lado (túnel infinito)
    if (posX < 0) posX = quantidade - 1;
    if (posX > quantidade - 1) posX = 0;
    if (posY < 0) posY = quantidade - 1;
    if (posY > quantidade - 1) posY = 0;

    // Desenha o fundo
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha a comida (vermelhinha pra chamar atenção)
    ctx.fillStyle = "red";
    ctx.fillRect(comidaX * tamanho, comidaY * tamanho, tamanho, tamanho);

    // Desenha a cobra
    ctx.fillStyle = "lime";
    for (let i = 0; i < rastro.length; i++) {
        ctx.fillRect(rastro[i].x * tamanho, rastro[i].y * tamanho, tamanho - 1, tamanho - 1);

        // Se a cobra morder a si mesma → reset
        if (rastro[i].x === posX && rastro[i].y === posY && (velocidadeX !== 0 || velocidadeY !== 0)) {
            alert("Game Over! Sua pontuação foi: " + (cauda - 5));
            posX = posY = 10;
            cauda = 5;
            velocidadeX = velocidadeY = 0;
        }
    }

    // Guarda posição atual no rastro (faz a cobra crescer)
    rastro.push({ x: posX, y: posY });
    while (rastro.length > cauda) {
        rastro.shift();
    }

    // Se comer a comida → aumenta a cauda e gera nova comida
    if (posX === comidaX && posY === comidaY) {
        cauda++;
        comidaX = Math.floor(Math.random() * quantidade);
        comidaY = Math.floor(Math.random() * quantidade);

        // Aqui daria pra mandar a pontuação pro backend em Python
        // tipo: fetch("http://localhost:5000/score", { method: "POST", body: JSON.stringify({score: cauda-5}) })
    }
}

// Controles de teclado
document.addEventListener("keydown", keyPush);

// Função de controle via teclado
function keyPush(event) {
    switch (event.keyCode) {
        case 37: // seta esquerda
            if (velocidadeX === 1) break; // impede de ir pro lado contrário direto
            velocidadeX = -1; velocidadeY = 0;
            break;
        case 38: // seta cima
            if (velocidadeY === 1) break;
            velocidadeX = 0; velocidadeY = -1;
            break;
        case 39: // seta direita
            if (velocidadeX === -1) break;
            velocidadeX = 1; velocidadeY = 0;
            break;
        case 40: // seta baixo
            if (velocidadeY === -1) break;
            velocidadeX = 0; velocidadeY = 1;
            break;
    }
}

// Controles pelos botões da tela (mobile friendly)
const Snake = {
    action: function (direction) {
        switch (direction) {
            case "left":
                if (velocidadeX === 1) break;
                velocidadeX = -1; velocidadeY = 0;
                break;
            case "up":
                if (velocidadeY === 1) break;
                velocidadeX = 0; velocidadeY = -1;
                break;
            case "right":
                if (velocidadeX === -1) break;
                velocidadeX = 1; velocidadeY = 0;
                break;
            case "down":
                if (velocidadeY === -1) break;
                velocidadeX = 0; velocidadeY = 1;
                break;
        }
    }
};

// Chama a função game a cada 100ms (velocidade da cobra)
setInterval(game, 100);