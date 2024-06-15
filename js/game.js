const GRAVITY = 0.5;

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
        // width, top, left
        // starting coords -> 150, 470, 40
        const platform1 = new Platform(this.gameView, 50, 250, 50);
        const platform2 = new Platform(this.gameView, 150, 470, 40);
        const platform3 = new Platform(this.gameView, 250, 350, 250);
        const platform4 = new Platform(this.gameView, 350, 400, 350);
        const platform5 = new Platform(this.gameView, 450, 450, 150);

        this.platforms.push(platform1, platform2, platform3, platform4, platform5);

        // create player                        // temporary (include platforms)
        this.player = new Player(this.gameView, this.platforms);

       // set interval
       let frames = 0;

       const intervalId = setInterval(() => {
        //console.log("interval")
        this.player.move();
        frames += 1;

        /*
        //pause for debugging

        if (frames > 600) {                
            clearInterval(intervalId);
        }
        */

       }, 1000 / 60);
    }
}