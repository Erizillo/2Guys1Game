const SPEED = 200;
const SPACING = 50;

const ROWS = 5;
const COLS = 15;
const BRICKWIDTH = 48;
const BRICKHEIGHT = 32;
const START_TIME = 60;

let level = 1;

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
let timeLeft;
let timeText;
let timerEvent;

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

    bricks = game.add.group();
    bricks.enableBody = true;

    if (level === 1) {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 15; col++) {
                let brick = bricks.create(SPACING + col * BRICKWIDTH, SPACING + row * BRICKHEIGHT, 'brick');
                brick.body.immovable = true;
            }
        }
    } else if (level === 2) {
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 10; col++) {
                if ((row + col) % 2 === 0) {
                    let brick = bricks.create(SPACING + col * BRICKWIDTH * 1.5, SPACING + row * BRICKHEIGHT, 'brick');
                    brick.body.immovable = true;
                }
            }
        }
    } else if (level === 3) {
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 12; col++) {
                if (row % 2 === 0) {
                    let brick = bricks.create(SPACING + col * BRICKWIDTH, SPACING + row * BRICKHEIGHT, 'brick');
                    brick.body.immovable = true;
                }
            }
        }
    }

    cursors = game.input.keyboard.createCursorKeys();

    score = 0;
    lives = 3;
    timeLeft = START_TIME;

    scoreText = game.add.text(10, 10, 'Score: ' + score, { font: '20px Arial', fill: '#ffffff' });
    livesText = game.add.text(10, 40, 'Lives: ' + lives, { font: '20px Arial', fill: '#ffffff' });
    timeText = game.add.text(GAME_STAGE_WIDTH - 150, 10, 'Time left: ' + timeLeft, { font: '20px Arial', fill: '#ffffff' });

    timerEvent = game.time.events.loop(Phaser.Timer.SECOND, decrementTimer, this);
}

function updateStage() {
    if (cursors.left.isDown) {
        paddle.body.velocity.x = -SPEED*2;
    } else if (cursors.right.isDown) {
        paddle.body.velocity.x = SPEED*2;
    } else {
        paddle.body.velocity.x = 0;
    }

    game.physics.arcade.collide(ball, paddle, hitPaddle, null, this);
    game.physics.arcade.collide(ball, bricks, hitBrick, null, this);

    if (ball.y >= GAME_STAGE_HEIGHT - ball.height/2) {
        lives--;
        livesText.text = 'Lives: ' + lives;

        if (lives > 0) {
            resetBall();
        } else {
            game.state.start('gameover');
        }
    }

    if (bricks.countLiving() === 0) {
        game.state.start('menu');
    }
}

function hitPaddle(ball, paddle) {
    let relativeIntersect = (ball.x - paddle.x) / (paddle.width / 2);
    relativeIntersect = Phaser.Math.clamp(relativeIntersect, -1, 1);
    let maxBounceAngle = Phaser.Math.degToRad(60);
    let bounceAngle = relativeIntersect * maxBounceAngle;
    let speed = Math.sqrt(ball.body.velocity.x * ball.body.velocity.x + ball.body.velocity.y * ball.body.velocity.y);
    ball.body.velocity.x = speed * Math.sin(bounceAngle);
    ball.body.velocity.y = -Math.abs(speed * Math.cos(bounceAngle));
}

function hitBrick(ball, brick) {
    brick.kill();
    score += 10;
    scoreText.text = 'Score: ' + score;
}

function resetBall() {
    ball.reset(game.world.centerX, GAME_STAGE_HEIGHT - SPACING*2);
    ball.body.velocity.set(SPEED, -SPEED);
}

function decrementTimer() {
    timeLeft--;
    timeText.text = 'Time left: ' + timeLeft;

    if (timeLeft <= 0) {
        game.time.events.remove(timerEvent);
        game.state.start('gameover');
    }
}