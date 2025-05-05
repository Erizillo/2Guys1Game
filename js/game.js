// --- CONFIGURACIÓN GLOBAL ---
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
let powerBallActive = false;
let stickyActive = false;
let stickyReady = false;
let spaceKey;
let flyingBricks;
let enemyProjectiles;

// --- PRELOAD ---
function preloadStage() {
    game.load.json('levelData', 'json/level' + level + '.json');
    game.load.image('powerup_expand', 'imgs/star.png');
    game.load.image('powerup_score', 'imgs/x2points.png');
    game.load.image('powerup_split', 'imgs/ball_red.png');
    game.load.image('powerup_powerball', 'imgs/ball_green.png');
    game.load.image('powerup_key', 'imgs/key.png');
    game.load.image('powerup_sticky', 'imgs/hole.png');
    game.load.image('block_strong', 'imgs/block_locked_small.png');
    game.load.image('block_weak', 'imgs/block_small.png');
    game.load.image('background_game', 'imgs/background_blue.png');
    game.load.image('bombattack', 'imgs/bomb.png');
    game.load.image('enemy', 'imgs/enemy.png');
    game.load.image('block_green', 'imgs/block_small.png');
    game.load.image('block_yellow', 'imgs/block_small_yellow.png');
    game.load.image('nuclear', 'imgs/nuclear.png');

    game.load.audio('rebotePaddle', 'sounds/BolaRebote.wav');
    game.load.audio('musicaGameplay', 'sounds/CancionGameplay.mp3');
    game.load.audio('musicaMenu', 'sounds/CancionMenu.mp3');
    game.load.audio('golpeLadrillo', 'sounds/LadrilloGolpe.mp3');
    game.load.audio('sonidoPowerup', 'sounds/PowerUp.mp3');
}

// --- LOAD ---
function loadStage() {
    let bg = game.add.sprite(0, 0, 'background_game');
    bg.width = GAME_STAGE_WIDTH;
    bg.height = GAME_STAGE_HEIGHT;

    paddle = game.add.sprite(game.world.centerX, GAME_STAGE_HEIGHT - SPACING, 'paddle');
    paddle.anchor.setTo(0.5);
    game.physics.arcade.enable(paddle);
    paddle.body.immovable = true;
    paddle.body.collideWorldBounds = true;

    ball = game.add.sprite(game.world.centerX, GAME_STAGE_HEIGHT - SPACING * 2, 'ball');
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

    levelData = game.cache.getJSON('levelData');
    let layout = levelData.layout;

    for (let row = 0; row < layout.length; row++) {
        for (let col = 0; col < layout[row].length; col++) {
            let cell = layout[row][col];
            let brick;

            if (level === 4) {
                // Nivel 4: bloques verdes y amarillos
                if (cell === 1) {
                    brick = bricks.create(SPACING + col * BRICKWIDTH, SPACING + row * BRICKHEIGHT, 'block_green');
                    brick.colorType = 'green';
                } else if (cell === 2) {
                    brick = bricks.create(SPACING + col * BRICKWIDTH, SPACING + row * BRICKHEIGHT, 'block_yellow');
                    brick.colorType = 'yellow';
                } else {
                    continue;
                }
                brick.health = 1;

            } else if (cell === 1) {
                if (level === 2) {
                    brick = bricks.create(SPACING + col * BRICKWIDTH, SPACING + row * BRICKHEIGHT, 'block_strong');
                    brick.health = 2;
                } else if (level === 3) {
                    brick = bricks.create(SPACING + col * BRICKWIDTH, SPACING + row * BRICKHEIGHT, 'block_weak');
                    brick.body.velocity.x = (col % 2 === 0 ? 50 : -50);
                    brick.body.collideWorldBounds = true;
                    brick.body.bounce.x = 1;
                    brick.health = 1;
                } else {
                    brick = bricks.create(SPACING + col * BRICKWIDTH, SPACING + row * BRICKHEIGHT, 'block_weak');
                    brick.health = 1;
                }
            }

            if (brick) {
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

    gameMusic = game.add.audio('musicaGameplay');
    gameMusic.loop = true;
    gameMusic.volume = 0.2;
    gameMusic.play();

    flyingBricks = game.add.group();
    flyingBricks.enableBody = true;

    enemyProjectiles = game.add.group();
    enemyProjectiles.enableBody = true;

    game.time.events.loop(Phaser.Timer.SECOND * 6, spawnFlyingBrick, this);
}
// --- UPDATE ---
function updateStage() {
    if (!spaceKey) spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    if (stickyActive) {
        balls.forEach(b => {
            b.x = paddle.x;
            b.y = paddle.y - paddle.height;
        });
    
        if (spaceKey.isDown) {
            balls.forEach(b => {
                b.body.velocity.set(SPEED, -SPEED);
            });
            stickyActive = false;
        }
    }

    if (cursors.left.isDown) {
        paddle.body.velocity.x = -SPEED * 2;
    } else if (cursors.right.isDown) {
        paddle.body.velocity.x = SPEED * 2;
    } else {
        paddle.body.velocity.x = 0;
    }

    balls.forEach(function (b) {
        game.physics.arcade.collide(b, paddle, hitPaddle, null, this);
        game.physics.arcade.collide(b, bricks, hitBrick, null, this);
    });

    game.physics.arcade.overlap(paddle, powerups, activatePowerup, null, this);

    balls.forEach(function (b) {
        if (b.y >= GAME_STAGE_HEIGHT - b.height / 2) {
            b.kill();
            if (balls.filter(ball => ball.alive).length === 0) {
                lives--;
                livesText.text = 'Lives: ' + lives;

                if (lives > 0) {
                    resetBall();
                } else {
                    if (gameMusic && gameMusic.isPlaying) gameMusic.stop();
                    game.state.start('gameover');
                }
            }
        }
    });
    // Colisiones con bricks voladores
    balls.forEach(b => {
        game.physics.arcade.collide(b, flyingBricks, hitFlyingBrick, null, this);
    });

    // Colisión de bala enemiga con paddle
    game.physics.arcade.overlap(paddle, enemyProjectiles, hitByProjectile, null, this);

    if (bricks.countLiving() === 0) {
        if (gameMusic && gameMusic.isPlaying) gameMusic.stop();
        game.state.start('win');
    }
}

// --- COLISIONES ---
function hitPaddle(ball, paddle) {
    let sonidoRebote = game.add.audio('rebotePaddle');
    sonidoRebote.play();

    if (stickyReady) {
        ball.body.velocity.set(0); // Detenemos la bola
        ball.x = paddle.x;
        ball.y = paddle.y - paddle.height;
        stickyActive = true;
        stickyReady = false;
        return;
    }

    let relativeIntersect = (ball.x - paddle.x) / (paddle.width / 2);
    relativeIntersect = Phaser.Math.clamp(relativeIntersect, -1, 1);
    let maxBounceAngle = Phaser.Math.degToRad(60);
    let bounceAngle = relativeIntersect * maxBounceAngle;
    let speed = Math.sqrt(ball.body.velocity.x ** 2 + ball.body.velocity.y ** 2);
    ball.body.velocity.x = speed * Math.sin(bounceAngle);
    ball.body.velocity.y = -Math.abs(speed * Math.cos(bounceAngle));
}

function hitBrick(ball, brick) {
    let sonidoGolpe = game.add.audio('golpeLadrillo');
    sonidoGolpe.volume = 0.5;
    sonidoGolpe.play();

    if (level === 2 && powerBallActive) {
        brick.health -= 2;
    } else {
        brick.health--;
    }

    if (level === 2 && brick.health === 1) {
        brick.loadTexture('block_weak');
    }

    if (brick.health <= 0) {

        if (level === 4) {
            let greenRemaining = bricks.filter(b => b.alive && b.colorType === 'green').total;
            let yellowRemaining = bricks.filter(b => b.alive && b.colorType === 'yellow').total;
        
            if ((brick.colorType === 'green' && greenRemaining === 1) ||
                (brick.colorType === 'yellow' && yellowRemaining === 1)) {
                let nuclear = powerups.create(brick.x, brick.y, 'nuclear');
                nuclear.anchor.setTo(0.5);
                nuclear.scale.setTo(0.2);
                nuclear.body.velocity.y = 100;
                nuclear.type = 'nuke';
            }
        }
        brick.kill();
        score += 10 * scoreMultiplier;
        scoreText.text = 'Score: ' + score;

        if (Math.random() < 0.2) {
            const powerupTypes = ['expand', 'score', 'split', 'powerball', 'sticky'];
            let chosen = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
            let spriteKey = chosen === 'powerball' ? 'powerup_key' :
                            chosen === 'sticky' ? 'powerup_sticky' :
                            'powerup_' + chosen;
            let powerup = powerups.create(brick.x + brick.width / 2, brick.y + brick.height / 2, spriteKey);
            if (chosen === 'score') powerup.scale.setTo(0.2);
            powerup.anchor.setTo(0.5);
            powerup.body.velocity.y = 100;
            powerup.type = chosen;
        }
    }
}

function activatePowerup(paddle, powerup) {
    let sonidoPower = game.add.audio('sonidoPowerup');
    sonidoPower.volume = 0.5;
    sonidoPower.play();

    powerup.kill();

    if (powerup.type === 'expand') {
        if (!expandActive) {
            expandActive = true;
            paddle.scale.x *= 1.5;
            game.time.events.add(Phaser.Timer.SECOND * 10, () => {
                paddle.scale.x /= 1.5;
                expandActive = false;
            });
        }
    } else if (powerup.type === 'score') {
        scoreMultiplier = 2;
    } else if (powerup.type === 'split') {
        let newBall = game.add.sprite(ball.x, ball.y, 'ball');
        newBall.anchor.setTo(0.5);
        game.physics.arcade.enable(newBall);
        newBall.body.velocity.set(-ball.body.velocity.x, ball.body.velocity.y);
        newBall.body.bounce.set(1);
        newBall.body.collideWorldBounds = true;
        balls.push(newBall);
    } else if (powerup.type === 'powerball') {
        balls.forEach(b => b.loadTexture('powerup_powerball'));
        powerBallActive = true;
        game.time.events.add(Phaser.Timer.SECOND * 10, () => {
            balls.forEach(b => {
                b.loadTexture('ball');
                b.scale.setTo(1);
            });
            powerBallActive = false;
        });
    } else if (powerup.type === 'sticky') {
        stickyReady = true; // Se activa en la próxima colisión con el paddle
    } else if (powerup.type === 'nuke') {
        if (gameMusic && gameMusic.isPlaying) gameMusic.stop();
        game.state.start('win');
    }
}

function resetBall() {
    balls.forEach(b => b.kill());
    let b = game.add.sprite(game.world.centerX, GAME_STAGE_HEIGHT - SPACING * 2, 'ball');
    b.anchor.setTo(0.5);
    game.physics.arcade.enable(b);
    b.body.velocity.set(SPEED, -SPEED);
    b.body.bounce.set(1);
    b.body.collideWorldBounds = true;
    balls = [b];
    ball = b;
}

function decrementTimer() {
    timeLeft--;
    timeText.text = 'Time left: ' + timeLeft;
    if (timeLeft <= 0) {
        game.time.events.remove(timerEvent);
        if (gameMusic && gameMusic.isPlaying) gameMusic.stop();
        game.state.start('gameover');
    }
}

function spawnFlyingBrick() {
    // Limita el número de enemigos a 2 simultáneos
    if (flyingBricks.countLiving() >= 2) return;

    let type = Math.random() < 0.5 ? 'reward' : 'bomb';
    let brick = flyingBricks.create(Math.random() * (GAME_STAGE_WIDTH - BRICKWIDTH), -BRICKHEIGHT, 'enemy');
    brick.scale.setTo(0.2);
    brick.body.velocity.y = Phaser.Math.between(30, 60);
    brick.body.velocity.x = Phaser.Math.between(-50, 50);
    brick.body.bounce.x = 1;
    brick.body.collideWorldBounds = true;
    brick.body.immovable = true;
    brick.type = type;

    if (type === 'bomb') {
        game.time.events.add(Phaser.Timer.SECOND * 2, () => shootFromBrick(brick), this);
    }
}

function shootFromBrick(brick) {
    if (!brick.alive || brick.type !== 'bomb') return;

    let bullet = enemyProjectiles.create(brick.x + BRICKWIDTH / 2, brick.y + BRICKHEIGHT, 'bombattack');
    bullet.anchor.setTo(0.5);
    bullet.scale.setTo(0.2);
    bullet.body.velocity.y = 200;
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;
}

function hitFlyingBrick(ball, brick) {
    if (brick.type === 'reward') {
        // 30% de lanzar powerup
        if (Math.random() < 0.3) {
            const powerupTypes = ['expand', 'score', 'split', 'powerball', 'sticky'];
            let chosen = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
            let spriteKey = chosen === 'powerball' ? 'powerup_key' :
                            chosen === 'sticky' ? 'powerup_sticky' :
                            'powerup_' + chosen;
            let powerup = powerups.create(brick.x, brick.y, spriteKey);
            if (chosen === 'score') {
                powerup.scale.setTo(0.2);
            }
            powerup.anchor.setTo(0.5);
            powerup.body.velocity.y = 100;
            powerup.type = chosen;
        }
    }
    brick.kill();
}

function hitByProjectile(paddle, projectile) {
    projectile.kill();
    score = Math.max(0, score - 30); // Resta 30 puntos
    scoreText.text = 'Score: ' + score;
}