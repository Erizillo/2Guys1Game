const SPEED = 200;
const SPACING = 50;
 // Propiedades del muro de ladrillos
const ROWS = 5;
const COLS = 15;
const BRICKWIDTH = 48;
const BRICKHEIGHT = 32;

// Estado principal del juego
let playState = {
    create: loadStage,
    update: updateStage
};

let paddle;
let ball;
let bricks;
let cursors;
let score;
let lives;
let scoreText;
let livesText;

function loadStage() {
    // Configuración del jugador (raqueta)
    paddle = game.add.sprite(game.world.centerX, GAME_STAGE_HEIGHT - SPACING, 'paddle');
    paddle.anchor.setTo(0.5);
    game.physics.arcade.enable(paddle);
    paddle.body.immovable = true;
    paddle.body.collideWorldBounds = true;

    // Configuración de la pelota
    ball = game.add.sprite(game.world.centerX, GAME_STAGE_HEIGHT - SPACING*2, 'ball');
    ball.anchor.setTo(0.5);
    game.physics.arcade.enable(ball);
    ball.body.velocity.set(SPEED, -SPEED);
    ball.body.bounce.set(1);
    ball.body.collideWorldBounds = true;

    // Grupo de ladrillos
    bricks = game.add.group();
    bricks.enableBody = true;

    // Despliegue del muro
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            let brick = bricks.create(SPACING + col * BRICKWIDTH, SPACING + row * BRICKHEIGHT, 'brick');
            brick.body.immovable = true;
        }
    }

    // Controles del jugador, teclado y ya
    cursors = game.input.keyboard.createCursorKeys();

    // Marcador y vidas
    score = 0;
    lives = 3;
    scoreText = game.add.text(10, 10, 'Score: ' + score, { font: '20px Arial', fill: '#ffffff' });
    livesText = game.add.text(10, 40, 'Lives: ' + lives, { font: '20px Arial', fill: '#ffffff' });
};

function updateStage() {
    // Movimiento de la raqueta
    if (cursors.left.isDown) {
        paddle.body.velocity.x = -SPEED*2;
    } else if (cursors.right.isDown) {
        paddle.body.velocity.x = SPEED*2;
    } else {
        paddle.body.velocity.x = 0;
    }

    // Colisiones
    game.physics.arcade.collide(ball, paddle, hitPaddle, null, this);
    game.physics.arcade.collide(ball, bricks, hitBrick, null, this);

    // Si la pelota cae
    if (ball.y >= GAME_STAGE_HEIGHT - ball.height/2) {
        lives--;
        livesText.text = 'Lives: ' + lives;

        if (lives > 0) {
            resetBall();
        } else {
            game.state.start('init');
        }
    }

    // Fin del juego si no quedan ladrillos
    if (bricks.countLiving() === 0) {
        game.state.start('init');
    }
};

function hitPaddle(ball, paddle) {
    let diff = 0;

    if (ball.x < paddle.x) {
        diff = paddle.x - ball.x;
        ball.body.velocity.x = (-10 * diff);
    } else if (ball.x > paddle.x) {
        diff = ball.x - paddle.x;
        ball.body.velocity.x = (10 * diff);
    } else {
        ball.body.velocity.x = 2 + Math.random() * 8;
    }
};

function hitBrick(ball, brick) {
    brick.kill();
    score += 10;
    scoreText.text = 'Score: ' + score;
};

function resetBall() {
    ball.reset(game.world.centerX, GAME_STAGE_HEIGHT - SPACING*2);
    ball.body.velocity.set(SPEED, -SPEED);
}