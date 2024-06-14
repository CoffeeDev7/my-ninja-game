const GRAVITY = 5;

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

        // create platforms
        const platform1 = new Platform(this.gameView, 50, 50, 50);
        const platform2 = new Platform(this.gameView, 150, 150, 150);
        const platform3 = new Platform(this.gameView, 250, 250, 250);
        const platform4 = new Platform(this.gameView, 350, 400, 350);
        const platform5 = new Platform(this.gameView, 450, 450, 450);

        this.platforms.push(platform1, platform2, platform3, platform4, platform5);

        // create player
        this.player = new Player(this.gameView, this.platforms);

       // set interval
       const intervalId = setInterval(() => {
        //console.log("interval")
        this.player.move();
       }, 1000 / 60);
    }
}