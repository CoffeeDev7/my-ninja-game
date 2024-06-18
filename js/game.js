const GRAVITY = 0.6;
const TERMINAL_VELOCITY = 12;

class Game {
    constructor() {
        this.splashView = document.getElementById("splash-view");
        this.gameView = document.getElementById("game-view");
        this.endView = document.getElementById("end-view");
        this.deathView = document.getElementById("death-view");
        this.victoryView = document.getElementById("victory-view");
        this.width = 900;
        this.height = 500;

        this.gameOver = false;
        this.player;

        this.platforms = [];
        this.enemies = [];

        this.enemyBoss;

        this.endLevel = false;
        

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

        this.gameOver = false;

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

        ////// needs work //////////
        

        this.displayPlayerLives();
        
        ///////////////////////////////////////////////////////////

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
          
            throwingEnemy.weapon.render();
            if (frames % 250 === 0 && !this.player.died) {
                if (!throwingEnemy.died) {
                    throwingEnemy.weapon.throw(this.player);
                }
            }
            
            this.enemies.forEach(enemy => {
                enemy.render();

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
                deadEnemies.push(throwingEnemy.weapon);
            }
            
            if (throwingEnemy.weaponHit(this.player.element)) {
                this.player.died = true;
                this.player.respawn();
            }

            if (this.player.lives === 0 || platformEnd.passedLevel(this.player.element)) {
                clearInterval(intervalId);
                /*
                this.gameView.style.display = "none";
                this.endView.style.display = "flex";
                */
                if (platformEnd.passedLevel(this.player.element)) {
                    this.gameOver = false;
                }
                else {
                    this.gameOver = true;
                }

                throwingEnemy.weapon.element.remove();
                this.restart();
                
                if (!this.gameOver) {
                    this.bossLevel();
                }
                else {
                    this.gameView.style.display = "none";
                    this.showDeathView();
                }
                //this.player.element.remove();
                //this.player = null; 
            }
        }, 1000 / 60);
    }

    bossLevel() {
        this.gameOver = false;
        this.gameView.classList.add("boss-level");
        this.endLevel = true;

        // create platforms
        const platform1 = new Platform(this.gameView, 150, 470, 15);
        const platform2 = new Platform(this.gameView, 200, 420, 215);
        const platform3 = new Platform(this.gameView, 150, 470, 465);
        const platform4 = new Platform(this.gameView, 200, 420, 665);
        const platformBoss = new Platform(this.gameView, 700, 100, 100);
        
        this.platforms.push(platform1, platform2, platform3, platform4, platformBoss);

        this.player = new Player(this.gameView, this.platforms);
        this.displayPlayerLives();

        //create boss and weapons
        const magicWeapon1 = new MagicalWeapon("images/special-wpn.png", null, this.gameView, 140, 120);
        const magicWeapon2 = new MagicalWeapon("images/special-wpn.png", null, this.gameView, 140, 700);

        // set boss lives
        this.enemyBoss = new EnemyBoss(this.gameView, "images/enemy-boss.png", platformBoss);
        this.enemies.push(this.enemyBoss, magicWeapon1, magicWeapon2);

        this.enemyBoss.positionX = 1;
        // create player
        // set lives
        

        let frames = 0;
        const intervalId = setInterval(() => {

            frames += 1;

            // make sure they don't come at the same time (?)
            if (frames % 250 === 0 && !this.player.died) {
                magicWeapon1.throw(this.player);
            }
            else if (frames % 400 === 0 && !this.player.died) {
                magicWeapon2.throw(this.player);
            }

            this.player.renderPlayer();
            //this.player.weapon.renderWeapon();
            this.enemies.forEach(enemy => {
                enemy.render();
            });

            if (this.enemyBoss.gotHit(this.player.weapon)) {
                this.enemyBoss.respawn();
            }

            if (!this.player.died) {
                if (
                    magicWeapon1.weaponHit(this.player.element) || 
                    magicWeapon2.weaponHit(this.player.element)
                ) {
                    this.player.died = true;
                    this.player.respawn();
                }
            }

            if (this.enemyBoss.lives === 0 || this.player.lives === 0) {
                clearInterval(intervalId);
                this.restart();
                this.gameView.style.display = "none";
                if (this.player.lives === 0) {
                    this.showDeathView();
                }
                else {
                    this.showVictoryView();
                }
            }

        }, 1000 / 60);

    }

    // restart method -> cleanup everything from the level
    restart() {
        this.gameView.classList.remove("boss-level");
        if (this.enemyBoss) {
            this.enemyBoss.livesContainer.remove();
        }
        this.platforms.forEach(platform => {
            platform.element.remove();
        });
        this.platforms = [];
        
        this.enemies.forEach(enemy => {
            enemy.element.remove();
        });
        this.enemies = [];

        if (this.livesElements.length > 0) {
            this.livesElements.forEach(item => {
                item.remove();
                
            });
            this.livesElements = [];
        }
        this.player.element.remove();
    }

    // show player lives in dom
    displayPlayerLives() {
        for (let i = 0; i < this.player.lives; i++) {
            const life = document.createElement("div");
            life.classList.add("life");
            document.getElementById("lives").appendChild(life);
        }

        this.livesElements = document.querySelectorAll(".life");
    }


    showDeathView() {
        this.deathView.style.display = "block";
        setTimeout(() => {
            this.deathView.style.display = "none";
            this.endView.style.display = "flex";
        }, 3000)
    }

    // add screen for winning game
    showVictoryView() {
        this.victoryView.style.display = "flex"
        setTimeout(() => {
            this.victoryView.style.display = "none";
            this.endView.style.display = "flex";
        }, 4000)
    }
    // maybe have message between first level and boss level
}