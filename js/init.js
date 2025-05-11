const GAME_STAGE_WIDTH = 800;
const GAME_STAGE_HEIGHT = 600;

let game = new Phaser.Game(GAME_STAGE_WIDTH, GAME_STAGE_HEIGHT, Phaser.AUTO, 'gamestage');

let initState = {
    create: function () {
        game.state.start('play');
    }
};

let splashState = {
    preload: function () {
        game.load.image('paddle', 'imgs/button_blue_thin.png');
        game.load.image('ball', 'imgs/ball_blue.png');
        game.load.image('brick', 'imgs/block_small.png');
        game.load.image('background', 'imgs/background_menu.jpg');

        game.load.audio('menuMusic', 'sounds/CancionMenu.mp3');
    },
    create: function () {
        let bg = game.add.sprite(0, 0, 'background');
        bg.width = GAME_STAGE_WIDTH;
        bg.height = GAME_STAGE_HEIGHT;

        let splashText = game.add.text(game.world.centerX, game.world.centerY, 'Welcome to Carcanoid!', { font: '40px Arial', fill: '#ffffff' });
        splashText.anchor.set(0.5);

        game.time.events.add(Phaser.Timer.SECOND * 2, function () {
            game.state.start('menu');
        }, this);
    }
};

let menuState = {

    preload: function () {
        game.load.image('background', 'imgs/background_menu.jpg');
        game.load.image('ball_blue', 'imgs/ball_blue.png');
        game.load.image('ball_red', 'imgs/ball_red.png');
        game.load.image('star', 'imgs/star.png');
        game.load.image('key', 'imgs/key.png');
        game.load.image('x2points', 'imgs/x2points.png');
        game.load.image('ball_green', 'imgs/ball_green.png');
    },

    create: function () {
        // Reproduce música del menú
        let bg = game.add.sprite(0, 0, 'background');
        bg.width = GAME_STAGE_WIDTH;
        bg.height = GAME_STAGE_HEIGHT;

        this.visualGroup = game.add.group();

        game.time.events.loop(Phaser.Timer.SECOND * 1, () => {
            dropVisualElement(this.visualGroup);
        }, this);

        let music = game.add.audio('menuMusic');
        music.loop = true;
        music.volume = 0.2;
        music.play();

        let title = game.add.text(game.world.centerX, 100, 'Carcanoid - Select Level', { font: '32px Arial', fill: '#ffffff' });
        title.anchor.set(0.5);

        let level1Text = game.add.text(game.world.centerX, 220, 'Press 1 for Level 1', { font: '22px Arial', fill: '#ffffff' });
        level1Text.anchor.set(0.5);

        let level2Text = game.add.text(game.world.centerX, 280, 'Press 2 for Level 2', { font: '22px Arial', fill: '#ffffff' });
        level2Text.anchor.set(0.5);

        let level3Text = game.add.text(game.world.centerX, 340, 'Press 3 for Level 3', { font: '22px Arial', fill: '#ffffff' });
        level3Text.anchor.set(0.5);

        let level4Text = game.add.text(game.world.centerX, 400, 'Press 4 for Level 4', { font: '22px Arial', fill: '#ffffff' });
        level4Text.anchor.set(0.5);
        
        let level5Text = game.add.text(game.world.centerX, 460, 'Press 5 for Level 5', { font: '22px Arial', fill: '#ffffff' });
        level5Text.anchor.set(0.5);

        let creditsText = game.add.text(game.world.centerX, 520, 'Press C for Credits', { font: '22px Arial', fill: '#ffffff' });
        creditsText.anchor.set(0.5);

        let key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        key1.onDown.add(function () {
            level = 1;
            music.stop();
            game.state.start('game');
        }, this);

        let key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        key2.onDown.add(function () {
            level = 2;
            music.stop();
            game.state.start('game');
        }, this);

        let key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        key3.onDown.add(function () {
            level = 3;
            music.stop();
            game.state.start('game');
        }, this);

        let key4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        key4.onDown.add(function () {
            level = 4;
            music.stop();
            game.state.start('game');
        }, this);
        let key5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
        key5.onDown.add(function () {
            level = 5;
            music.stop();
            game.state.start('game');
        }, this);
        let keyC = game.input.keyboard.addKey(Phaser.Keyboard.C);
        keyC.onDown.add(function () {
            music.stop();
            game.state.start('credits');
        }, this);
    }
};

function dropVisualElement(group) {
    let elements = ['ball_blue', 'ball_red', 'star', 'key', 'x2points', 'ball_green'];
    let chosen = elements[Math.floor(Math.random() * elements.length)];
    let x = Math.random() * GAME_STAGE_WIDTH;
    let sprite = game.add.sprite(x, -50, chosen);
    sprite.anchor.setTo(0.5);

    // Escala específica para el icono de puntos x2
    if (chosen === 'x2points') {
        sprite.scale.setTo(0.1);
    }

    group.add(sprite); // Añadir al grupo para que quede detrás del texto

    let duration = Phaser.Math.between(5000, 8000);
    let tween = game.add.tween(sprite).to({ y: GAME_STAGE_HEIGHT + 50 }, duration, Phaser.Easing.Linear.None, true);
    tween.onComplete.add(() => sprite.destroy());
}

let creditsState = {
    preload: function () {
        game.load.image('background', 'imgs/background_menu.png');
        game.load.image('ball_blue', 'imgs/ball_blue.png');
        game.load.image('ball_red', 'imgs/ball_red.png');
        game.load.image('star', 'imgs/star.png');
        game.load.image('key', 'imgs/key.png');
        game.load.image('x2points', 'imgs/x2points.png');
        game.load.image('ball_green', 'imgs/ball_green.png');
    },

    create: function () {
        // Fondo
        let bg = game.add.sprite(0, 0, 'background');
        bg.width = GAME_STAGE_WIDTH;
        bg.height = GAME_STAGE_HEIGHT;

        this.visualGroup = game.add.group();

        // Animación visual de fondo
        game.time.events.loop(Phaser.Timer.SECOND * 1, () => {
            dropVisualElement(this.visualGroup);
        }, this);

        // Texto en primer plano
        let credits = game.add.text(game.world.centerX, game.world.centerY, 'Created by\nAdrian Stoican\n&\nEric Olle\n\nPress M for Menu', {
            font: '24px Arial', fill: '#ffffff', align: 'center'
        });
        credits.anchor.set(0.5);

        // Tecla para volver
        let keyM = game.input.keyboard.addKey(Phaser.Keyboard.M);
        keyM.onDown.add(() => game.state.start('menu'));
    }
};

let gameoverState = {
    preload: function () {
        game.load.image('background_red', 'imgs/background_lose.jpg');
    },
    
    create: function () {
        let bg = game.add.sprite(0, 0, 'background_red');
        bg.width = GAME_STAGE_WIDTH;
        bg.height = GAME_STAGE_HEIGHT;
        let gameOverText = game.add.text(game.world.centerX, game.world.centerY, 'Game Over\nPress M for Menu', { font: '32px Arial', fill: '#ff0000', align: 'center' });
        gameOverText.anchor.set(0.5);

        let music = game.add.audio('menuMusic');
        music.loop = true;
        music.volume = 0.2;
        music.play();

        let keyM = game.input.keyboard.addKey(Phaser.Keyboard.M);
        keyM.onDown.add(function () {
            music.stop();
            game.state.start('menu');
        }, this);
    }
};

let winState = {
    preload: function () {
        game.load.image('background_green', 'imgs/background_win.jpg');
    },

    create: function () {
        let bg = game.add.sprite(0, 0, 'background_green');
        bg.width = GAME_STAGE_WIDTH;
        bg.height = GAME_STAGE_HEIGHT;

        let winText = game.add.text(game.world.centerX, game.world.centerY - 50, 'HAS GANADO', {
            font: '40px Arial', fill: '#00ff00', align: 'center'
        });
        winText.anchor.set(0.5);

        let scoreDisplay = game.add.text(game.world.centerX, game.world.centerY + 20, 'Tu puntuación ha sido: ' + score, {
            font: '24px Arial', fill: '#ffffff', align: 'center'
        });
        scoreDisplay.anchor.set(0.5);

        let menuInstruction = game.add.text(game.world.centerX, game.world.centerY + 80, 'Pulsa M para volver al menú', {
            font: '20px Arial', fill: '#ffffff', align: 'center'
        });
        menuInstruction.anchor.set(0.5);

        let music = game.add.audio('menuMusic');
        music.loop = true;
        music.volume = 0.2;
        music.play();

        let keyM = game.input.keyboard.addKey(Phaser.Keyboard.M);
        keyM.onDown.add(function () {
            music.stop();
            game.state.start('menu');
        }, this);
    }
};



game.state.add('splash', splashState);
game.state.add('menu', menuState);
game.state.add('credits', creditsState);
game.state.add('gameover', gameoverState);
game.state.add('win', winState);
game.state.add('init', initState);
game.state.add('game', playState);

game.state.start('splash');
