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

        // Carga de música del menú
        game.load.audio('menuMusic', 'sounds/CancionMenu.mp3');
    },
    create: function () {
        let splashText = game.add.text(game.world.centerX, game.world.centerY, 'Welcome to Carcanoid!', { font: '40px Arial', fill: '#ffffff' });
        splashText.anchor.set(0.5);

        game.time.events.add(Phaser.Timer.SECOND * 2, function () {
            game.state.start('menu');
        }, this);
    }
};

let menuState = {
    create: function () {
        // Reproduce música del menú en bucle
        let music = game.add.audio('menuMusic');
        music.loop = true;
        music.volume = 0.2;
        music.play();

        let title = game.add.text(game.world.centerX, 100, 'Carcanoid - Select Level', { font: '32px Arial', fill: '#ffffff' });
        title.anchor.set(0.5);

        let level1Text = game.add.text(game.world.centerX, 220, 'Press 1 for Level 1', { font: '24px Arial', fill: '#ffffff' });
        level1Text.anchor.set(0.5);

        let level2Text = game.add.text(game.world.centerX, 280, 'Press 2 for Level 2', { font: '24px Arial', fill: '#ffffff' });
        level2Text.anchor.set(0.5);

        let level3Text = game.add.text(game.world.centerX, 340, 'Press 3 for Level 3', { font: '24px Arial', fill: '#ffffff' });
        level3Text.anchor.set(0.5);

        let creditsText = game.add.text(game.world.centerX, 400, 'Press C for Credits', { font: '24px Arial', fill: '#ffffff' });
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

        let keyC = game.input.keyboard.addKey(Phaser.Keyboard.C);
        keyC.onDown.add(function () {
            music.stop();
            game.state.start('credits');
        }, this);
    }
};

let creditsState = {
    create: function () {
        let credits = game.add.text(game.world.centerX, game.world.centerY, 'Created by\nAdrian Stoican\n&\nEric Olle\nPress M for Menu', { font: '24px Arial', fill: '#ffffff', align: 'center' });
        credits.anchor.set(0.5);

        let keyM = game.input.keyboard.addKey(Phaser.Keyboard.M);
        keyM.onDown.add(function () {
            game.state.start('menu');
        }, this);
    }
};

let gameoverState = {
    create: function () {
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
    create: function () {
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
