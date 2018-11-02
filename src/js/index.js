const game = {
    width: 800,
    height: 600,
    ctx: undefined,
    words: ['software','javascript','python'],
    running: true,
    gameStarted: false,
    sprites: {
        background: undefined
    },
    sound: {

    },
    init: function() {
        const canvas = document.getElementById('wisielec');
        this.ctx = canvas.getContext("2d");
        this.ctx.font = "15px PressStart";
        this.ctx.fillStyle = "#fff";
    },
    load: function() {
        for(let key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = `./src/sprites/${key}.png`;
        }
    },
    start: function() {
        this.init();
        this.load();
        this.run();
    }

}

window.addEventListener("load", () => {
    game.start();
  });