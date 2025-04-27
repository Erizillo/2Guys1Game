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
            game.state.start('game');
        }, this);

        let key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        key2.onDown.add(function () {
            level = 2;
            game.state.start('game');
        }, this);

        let key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        key3.onDown.add(function () {
            level = 3;
            game.state.start('game');
        }, this);

        let keyC = game.input.keyboard.addKey(Phaser.Keyboard.C);
        keyC.onDown.add(function () {
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

        let keyM = game.input.keyboard.addKey(Phaser.Keyboard.M);
        keyM.onDown.add(function () {
            game.state.start('menu');
        }, this);
    }
};



game.state.add('splash', splashState);
game.state.add('menu', menuState);
game.state.add('credits', creditsState);
game.state.add('gameover', gameoverState);
game.state.add('init', initState);
game.state.add('game', playState);


game.state.start('splash');
