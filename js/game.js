const GRAVITY = 0.6;
const TERMINAL_VELOCITY = 12;

class Game {
    constructor() {
        this.splashView = document.getElementById("splash-view");
        this.gameView = document.getElementById("game-view");
        this.endView = document.getElementById("end-view");
        this.width = 900;
        this.height = 500;

        this.gameOver = false;
        this.player;

        this.platforms = [];
        this.enemies = [];

        this.enemyBoss;

        // add game over conditions & view

        // display lives -> could maybe use different method
        

        this.livesElements = [];
    }

    start() {
        // set height and width for game view
        this.gameView.style.width = `${this.width}px`;
        this.gameView.style.height = `${this.height}px`;
        
        // hide other views
        this.splashView.style.display = "none";
        this.endView.style.display = "none";

        this.gameView.style.display = "block";

        ////// needs work //////////
        if (this.livesElements.length > 0) {
            this.livesElements.forEach(life => {
                life.remove();
            });
        }

        for (let i = 0; i < 5; i++) {
            const life = document.createElement("div");
            life.classList.add("life");
            document.getElementById("lives").appendChild(life);
        }

        this.livesElements = document.querySelectorAll(".life");
        ///////////////////////////////////////////////////////////

        // create platforms
        // width, top, left
        // starting coords -> 150, 470, 40
        const platform1 = new Platform(this.gameView, 150, 470, 0);
        const platform2 = new Platform(this.gameView, 50, 410, 170);//*
        const platform3 = new Platform(this.gameView, 250, 350, 250);//*
        //const platform4 = new Platform(this.gameView, 100, 300, 330);//
        const platform5 = new Platform(this.gameView, 250, 290, 520);//
        const platform6 = new Platform(this.gameView, 75, 230, 800);
        const platform7 = new Platform(this.gameView, 300, 200, 400);
        const platform8 = new Platform(this.gameView, 75, 200, 210); 
        const platform9 = new Platform(this.gameView, 100, 150, 100);
        const platform10 = new Platform(this.gameView, 350, 100, 250);
        //const platformEnd = new Platform(this.gameView, 170, 100, 720);
        const platformEnd = new EndPlatform(this.gameView);

        //(!) removed 4

        // add to array for collision detection 
        this.platforms.push(platform1, platform2, platform3, platform5,
            platform6, platform7, platform8, platform9, platform10, platformEnd
        );

        // create enemies
        const basicEnemy1 = new BasicEnemy(this.gameView, 
            "images/basic-enemy-ninja-1.png", platform7
        );
        const basicEnemy2 = new BasicEnemy(this.gameView,
            "images/basic-enemy-ninja-3.png", platform3
        );
        const basicEnemy3 = new BasicEnemy(this.gameView,
            "images/basic-enemy-ninja-2.png", platform5
        );

        basicEnemy1.positionX = 1;
        basicEnemy2.positionX = -1;
        basicEnemy3.positionX = 1;

        const throwingEnemy = new ThrowingEnemy(this.gameView, 
            "images/throwing-enemy-ninja.png", platform9, 
        )

        throwingEnemy.left -= 42;
        throwingEnemy.element.style.left = `${throwingEnemy.left}px`;

        this.enemies.push(basicEnemy1, basicEnemy2, basicEnemy3, throwingEnemy);

        // create player                        // temporary (include platforms)
        this.player = new Player(this.gameView, this.platforms);

       // set interval
       let frames = 0;

       const intervalId = setInterval(() => {
        //console.log("interval")

        // pause for debugging
        
        /*
        if (frames > 600) {                
            clearInterval(intervalId);
        }
        */

        frames += 1;

        const deadEnemies = [];


        this.player.renderPlayer();
        this.player.weapon.renderWeapon();

        // temporary /////////////////////////
        
        
        if (!throwingEnemy.died) {
            throwingEnemy.weapon.renderWeapon();
            if (frames % 300 === 0 && !this.player.died) {
                throwingEnemy.weapon.throw(this.player);
            }
        }
        
        /////////////////////////

        this.enemies.forEach(enemy => {
            enemy.move();

            if (enemy.didCollide(this.player.element)) {
                this.player.died = true;
                this.player.respawn();
            }
            else if (enemy.gotHit(this.player.weapon)) {
                enemy.died = true;
                deadEnemies.push(enemy);
                enemy.element.remove();
            }
        });

        if (throwingEnemy.died) {
            throwingEnemy.weapon.element.remove();
            //throwingEnemy.weapon = null;
        }
        
        if (throwingEnemy.weaponHit(this.player.element)) {
            this.player.died = true;
            this.player.respawn();
        }

        if (this.player.lives === 0 || platformEnd.passedLevel(this.player.element)) {
            clearInterval(intervalId);
            this.gameView.style.display = "none";
            this.endView.style.display = "flex";

            this.platforms.forEach(platform => {
                platform.element.remove();
            });

            this.enemies.forEach(enemy => {
                enemy.element.remove();
            });
            
            this.player.element.remove();
        }

       }, 1000 / 60);
    }
}