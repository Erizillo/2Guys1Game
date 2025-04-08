const GAME_STAGE_WIDTH = 800;
const GAME_STAGE_HEIGHT = 600;

let game = new Phaser.Game(GAME_STAGE_WIDTH, GAME_STAGE_HEIGHT, Phaser.AUTO, 'gamestage');

// Estado inicial del juego
let initState = {
    preload: function () {
        game.load.image('paddle', 'assets/imgs/button_blue_thin.png');
        game.load.image('ball', 'assets/imgs/ball_blue.png');
        game.load.image('brick', 'assets/imgs/block_small.png');
    },

    create: function () {
        game.state.start('play');
    }
};

// Agregar estados al juego
game.state.add('init', initState);
game.state.add('play', playState);

game.state.start('init');
