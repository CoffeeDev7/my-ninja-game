const GRAVITY = 0.6;
const TERMINAL_VELOCITY = 15;

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

        // display lives
        for (let i = 0; i < this.lives; i++) {
            const life = document.createElement("div");
            life.classList.add("life");
            document.getElementById("lives").appendChild(life);
        }

        this.livesElements = document.querySelectorAll(".life");
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
        const platform1 = new Platform(this.gameView, 150, 470, 0);
        const platform2 = new Platform(this.gameView, 50, 420, 200);
        const platform3 = new Platform(this.gameView, 250, 370, 250);
        const platform4 = new Platform(this.gameView, 100, 300, 330);
        const platform5 = new Platform(this.gameView, 250, 290, 520);
        const platform6 = new Platform(this.gameView, 75, 230, 800);
        const platform7 = new Platform(this.gameView, 300, 200, 400);
        const platform8 = new Platform(this.gameView, 75, 200, 210); 
        const platform9 = new Platform(this.gameView, 100, 150, 100);
        const platform10 = new Platform(this.gameView, 350, 100, 250);
        const platformEnd = new Platform(this.gameView, 170, 100, 720);

        this.platforms.push(platform1, platform2, platform3, platform4, platform5,
            platform6, platform7, platform8, platform9, platform10, platformEnd
        );

        // create player                        // temporary (include platforms)
        this.player = new Player(this.gameView, this.platforms);

       // set interval
       let frames = 0;

       const intervalId = setInterval(() => {
        //console.log("interval")
        this.player.move();
        this.player.renderPlayer();
        this.player.weapon.renderWeapon();
        frames += 1;

        
        //pause for debugging
        /*
        if (frames > 600) {                
            clearInterval(intervalId);
        }
        */

       }, 1000 / 60);
    }
}