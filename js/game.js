const SPEED = 200;
const SPACING = 50;

const ROWS = 5;
const COLS = 15;
const BRICKWIDTH = 48;
const BRICKHEIGHT = 32;
const START_TIME = 60;

let level = 1;

let playState = {
    preload: preloadStage,
    create: loadStage,
    update: updateStage
};

let paddle;
let ball;
let balls = [];
let bricks;
let cursors;
let score;
let lives;
let scoreText;
let livesText;
let timeLeft;
let timeText;
let timerEvent;
let levelData;
let powerups;
let scoreMultiplier = 1;
let expandActive = false;
let gameMusic;

// Carga de imágenes 
function preloadStage() {
    game.load.json('levelData', 'json/level' + level + '.json');
    game.load.image('powerup_expand', 'imgs/star.png');
    game.load.image('powerup_score', 'imgs/x2points.png');
    game.load.image('powerup_split', 'imgs/ball_red.png');
    game.load.image('block_strong', 'imgs/block_locked_small.png');
    game.load.image('block_weak', 'imgs/block_small.png');

// Sonidos
    game.load.audio('rebotePaddle', 'sounds/BolaRebote.wav');
    game.load.audio('musicaGameplay', 'sounds/CancionGameplay.mp3');
    game.load.audio('musicaMenu', 'sounds/CancionMenu.mp3');
    game.load.audio('golpeLadrillo', 'sounds/LadrilloGolpe.mp3');
    game.load.audio('sonidoPowerup', 'sounds/PowerUp.mp3');
}

function loadStage() {
    paddle = game.add.sprite(game.world.centerX, GAME_STAGE_HEIGHT - SPACING, 'paddle');
    paddle.anchor.setTo(0.5);
    game.physics.arcade.enable(paddle);
    paddle.body.immovable = true;
    paddle.body.collideWorldBounds = true;

    ball = game.add.sprite(game.world.centerX, GAME_STAGE_HEIGHT - SPACING*2, 'ball');
    ball.anchor.setTo(0.5);
    game.physics.arcade.enable(ball);
    ball.body.velocity.set(SPEED, -SPEED);
    ball.body.bounce.set(1);
    ball.body.collideWorldBounds = true;
    balls = [ball];

    bricks = game.add.group();
    bricks.enableBody = true;

    powerups = game.add.group();
    powerups.enableBody = true;
    // Carga de como se ve el mapeado
    levelData = game.cache.getJSON('levelData');
    let layout = levelData.layout;
    for (let row = 0; row < layout.length; row++) {
        for (let col = 0; col < layout[row].length; col++) {
            if (layout[row][col] === 1) {
                let brick;
                if (level === 2) {
                    // Nivel 2: ladrillos con dos vidas
                    brick = bricks.create(SPACING + col * BRICKWIDTH, SPACING + row * BRICKHEIGHT, 'block_strong');
                    brick.health = 2;
                } else if (level === 3) {
                    // Nivel 3: ladrillos móviles
                    brick = bricks.create(SPACING + col * BRICKWIDTH, SPACING + row * BRICKHEIGHT, 'block_weak');
                    brick.body.velocity.x = (col % 2 === 0 ? 50 : -50);
                    brick.body.collideWorldBounds = true;
                    brick.body.bounce.x = 1;
                    brick.health = 1;
                } else {
                    brick = bricks.create(SPACING + col * BRICKWIDTH, SPACING + row * BRICKHEIGHT, 'block_weak');
                    brick.health = 1;
                }
                brick.body.immovable = true;
            }
        }
    }

    cursors = game.input.keyboard.createCursorKeys();

    score = 0;
    lives = 3;
    timeLeft = level === 2 ? START_TIME * 2 : START_TIME;

    scoreText = game.add.text(10, 10, 'Score: ' + score, { font: '20px Arial', fill: '#ffffff' });
    livesText = game.add.text(10, 40, 'Lives: ' + lives, { font: '20px Arial', fill: '#ffffff' });
    timeText = game.add.text(GAME_STAGE_WIDTH - 150, 10, 'Time left: ' + timeLeft, { font: '20px Arial', fill: '#ffffff' });

    timerEvent = game.time.events.loop(Phaser.Timer.SECOND, decrementTimer, this);

    // Música de fondo del gameplay
    gameMusic = game.add.audio('musicaGameplay');
    gameMusic.loop = true;
    gameMusic.volume = 0.2;
    gameMusic.play();
}

function updateStage() {
    if (cursors.left.isDown) {
        paddle.body.velocity.x = -SPEED*2;
    } else if (cursors.right.isDown) {
        paddle.body.velocity.x = SPEED*2;
    } else {
        paddle.body.velocity.x = 0;
    }
    // Colisiones
    balls.forEach(function(b) {
        game.physics.arcade.collide(b, paddle, hitPaddle, null, this);
        game.physics.arcade.collide(b, bricks, hitBrick, null, this);
    });

    game.physics.arcade.overlap(paddle, powerups, activatePowerup, null, this);
    // Comprobación de pérdida de bolas
    balls.forEach(function(b) {
        if (b.y >= GAME_STAGE_HEIGHT - b.height/2) {
            b.kill();
            if (balls.filter(ball => ball.alive).length === 0) {
                lives--;
                livesText.text = 'Lives: ' + lives;

                if (lives > 0) {
                    resetBall();
                } else {
                    if (gameMusic && gameMusic.isPlaying) {
                        gameMusic.stop();
                    }
                    game.state.start('gameover');
                }
            }
        }
    });

    // Si se destruyen todos los ladrillos entramos a pantalla de win
    if (bricks.countLiving() === 0) {
        if (gameMusic && gameMusic.isPlaying) {
            gameMusic.stop();
        }
        game.state.start('win');
    }
}

// Control del rebote
function hitPaddle(ball, paddle) {
    let sonidoRebote = game.add.audio('rebotePaddle');
    sonidoRebote.play();

    // Calcula ángulo de rebote en base a la posición
    let relativeIntersect = (ball.x - paddle.x) / (paddle.width / 2);
    relativeIntersect = Phaser.Math.clamp(relativeIntersect, -1, 1);
    let maxBounceAngle = Phaser.Math.degToRad(60);
    let bounceAngle = relativeIntersect * maxBounceAngle;
    let speed = Math.sqrt(ball.body.velocity.x * ball.body.velocity.x + ball.body.velocity.y * ball.body.velocity.y);
    ball.body.velocity.x = speed * Math.sin(bounceAngle);
    ball.body.velocity.y = -Math.abs(speed * Math.cos(bounceAngle));
}

// Control al golpear con ladrillos
function hitBrick(ball, brick) {
    let sonidoGolpe = game.add.audio('golpeLadrillo');
    sonidoGolpe.volume = 0.5;
    sonidoGolpe.play();

    // Cambia la textura del ladrillo si tiene varias vidas (solo en nivel 2)
    brick.health--;
    if (level === 2 && brick.health === 1) {
        brick.loadTexture('block_weak');
    }

    // Si la salud llega a cero el ladrillo se rompe
    if (brick.health <= 0) {
        brick.kill();
        score += 10 * scoreMultiplier;
        scoreText.text = 'Score: ' + score;

        // 20% de probabilidad de soltar un power-up al destruir el ladrillo
        if (Math.random() < 0.2) {
            const powerupTypes = ['expand', 'score', 'split'];
            let chosen = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
            let spriteKey = 'powerup_' + chosen;
            let powerup = powerups.create(brick.x + brick.width / 2, brick.y + brick.height / 2, spriteKey);
            if (chosen === 'score') {
                powerup.scale.setTo(0.2);
            }
            powerup.anchor.setTo(0.5);
            powerup.body.velocity.y = 100;
            powerup.type = chosen;
        }
    }
}

// Aplicación de powerups
function activatePowerup(paddle, powerup) {
    let sonidoPower = game.add.audio('sonidoPowerup');
    sonidoPower.volume = 0.5;
    sonidoPower.play();

    powerup.kill();

    // Powerup de expansión del paddle
    if (powerup.type === 'expand') {
        if (!expandActive) {
            expandActive = true;
            paddle.scale.x *= 1.5;
            game.time.events.add(Phaser.Timer.SECOND * 10, function () {
                paddle.scale.x /= 1.5;
                expandActive = false;
            }, this);
        }
    }
    // Powerup de x2
    else if (powerup.type === 'score') {
        scoreMultiplier = 2;
    }
    // Power-up de añadir bolas
    else if (powerup.type === 'split') {
        let newBall = game.add.sprite(ball.x, ball.y, 'ball');
        newBall.anchor.setTo(0.5);
        game.physics.arcade.enable(newBall);
        newBall.body.velocity.set(-ball.body.velocity.x, ball.body.velocity.y);
        newBall.body.bounce.set(1);
        newBall.body.collideWorldBounds = true;
        balls.push(newBall);
    }
}

// Reinicia la pelota después de perder una vida
function resetBall() {
    balls.forEach(b => b.kill());

    // Crea una nueva bola en el centro
    let b = game.add.sprite(game.world.centerX, GAME_STAGE_HEIGHT - SPACING * 2, 'ball');
    b.anchor.setTo(0.5);
    game.physics.arcade.enable(b);
    b.body.velocity.set(SPEED, -SPEED);
    b.body.bounce.set(1);
    b.body.collideWorldBounds = true;
    balls = [b];
    ball = b;
}

// Temporizador
function decrementTimer() {
    timeLeft--;
    timeText.text = 'Time left: ' + timeLeft;

    // Si el tiempo se acaba se termina el juego, pantalla de game over
    if (timeLeft <= 0) {
        game.time.events.remove(timerEvent);
        if (gameMusic && gameMusic.isPlaying) {
            gameMusic.stop();
        }
        game.state.start('gameover');
    }
}