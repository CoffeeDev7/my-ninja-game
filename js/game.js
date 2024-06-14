class Game {
    constructor() {
        this.splashView = document.getElementById("splash-view");
        this.gameView = document.getElementById("game-view");
        this.endView = document.getElementById("end-view");
        this.width = 900;
        this.height = 500;

        this.lives = 5;
        this.gameOver = false;
        this.player;

        this.platforms = [];
        this.enemies = [];

        this.enemyBoss;
    }

    start() {
        // set height and width for game view
       this.gameView.style.width = `${this.width}px`;
       this.gameView.style.height = `${this.height}px`;
       
       // hide other views
       this.splashView.style.display = "none";
       this.endView.style.display = "none";

       this.gameView.style.display = "block";

       // create player

       // create platforms

       // set interval
    }
}