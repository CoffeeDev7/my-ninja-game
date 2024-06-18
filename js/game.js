const GRAVITY = 0.6;
const TERMINAL_VELOCITY = 12;

class Game {
    constructor() {
        // on screen elements
        this.splashView = document.getElementById("splash-view");
        this.gameView = document.getElementById("game-view");
        this.endView = document.getElementById("end-view");
        this.deathView = document.getElementById("death-view");
        this.victoryView = document.getElementById("victory-view");
        this.transitionView = document.getElementById("transition-view");

        // current level
        this.level = 0;
        this.gameOver = false;

        // game view dimensions
        this.width = 900;
        this.height = 500;

        // player, platforms, enemies 
        this.player;
        this.platforms = [];
        this.enemies = [];

        // special enemy, special controls for final level
        this.enemyBoss;
        this.endLevel = false;
        
        // player lives displayed on screen
        this.livesElements = [];
    }

    start() {
        // starting conditions for new game
        this.level = 0;
        this.gameOver = false;
        
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
        const platform2 = new Platform(this.gameView, 50, 410, 170);
        const platform3 = new Platform(this.gameView, 250, 350, 250);
        //const platform4 = new Platform(this.gameView, 100, 300, 330);//
        const platform5 = new Platform(this.gameView, 250, 290, 520);
        const platform6 = new Platform(this.gameView, 75, 230, 800);
        const platform7 = new Platform(this.gameView, 300, 200, 400);
        const platform8 = new Platform(this.gameView, 75, 200, 210); 
        const platform9 = new Platform(this.gameView, 100, 150, 100);
        const platform10 = new Platform(this.gameView, 350, 100, 250);
        
        // special platform with flag to signify level is passed
        const platformEnd = new EndPlatform(this.gameView);

        //(!) removed platform4

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

        // set enemies in motion
        basicEnemy1.positionX = 1;
        basicEnemy2.positionX = -1;
        basicEnemy3.positionX = 1;

        // special enemy
        const throwingEnemy = new ThrowingEnemy(this.gameView, 
            "images/throwing-enemy-ninja.png", platform9, 
        )

        // set location of special enemy (who doesn't move)
        throwingEnemy.left -= 42;
        throwingEnemy.element.style.left = `${throwingEnemy.left}px`;

        // push to array for collision detection
        this.enemies.push(basicEnemy1, basicEnemy2, basicEnemy3, throwingEnemy);

        // create player                        // temporary (include platforms)
        this.player = new Player(this.gameView, this.platforms);
        // display player lives on screen
        this.displayPlayerLives();

       // set interval, track frames
       let frames = 0;
       const intervalId = setInterval(() => {

            // pause for debugging
            
            /*
            if (frames > 600) {                
                clearInterval(intervalId);
            }
            */

            frames += 1;

            // array of dead enemies for cleanup
            const deadEnemies = [];

            // render player
            this.player.renderPlayer();
          
            // render enemy weapon, throw at regular intervals
            throwingEnemy.weapon.render();
            if (frames % 250 === 0 && !this.player.died) {

                // only throw if owner didn't die
                if (!throwingEnemy.died) {
                    throwingEnemy.weapon.throw(this.player);
                }
            }
            
            // render enemies, detect collision
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

            // add enemy weapon to deads array if owner died
            if (throwingEnemy.died) {
                deadEnemies.push(throwingEnemy.weapon);
            }
            
            // detect collision for enemy weapon
            if (throwingEnemy.weaponHit(this.player.element)) {
                this.player.died = true;
                this.player.respawn();
            }

            // check for game over / passed level
            if (this.player.lives === 0 || platformEnd.passedLevel(this.player.element)) {
                clearInterval(intervalId);

                if (this.player.lives === 0) {
                    this.gameOver = true;
                }
                else {
                    this.gameOver = false;
                }

                // remove all enemies, player, platforms
                throwingEnemy.weapon.element.remove();
                this.restart();
                
                // go to level transition or death view
                if (!this.gameOver) {
                    this.level = 1;
                    this.levelTransition("images/enemy-boss.png", this.level);
                }
                else {
                    this.showDeathView();
                }
            }
        }, 1000 / 60);
    }

    bossLevel() {
        // activate special controls for final level
        this.gameOver = false;
        this.gameView.classList.add("boss-level");
        this.endLevel = true;

        // create platforms, add to array
        const platform1 = new Platform(this.gameView, 150, 470, 15);
        const platform2 = new Platform(this.gameView, 200, 420, 215);
        const platform3 = new Platform(this.gameView, 150, 470, 465);
        const platform4 = new Platform(this.gameView, 200, 420, 665);
        const platformBoss = new Platform(this.gameView, 700, 100, 100);
        
        this.platforms.push(platform1, platform2, platform3, platform4, platformBoss);

        // create player, display lives
        this.player = new Player(this.gameView, this.platforms);
        this.displayPlayerLives();

        //create boss and weapons, add to enemies array
        const magicWeapon1 = new MagicalWeapon("images/special-wpn.png", null, this.gameView, 140, 120);
        const magicWeapon2 = new MagicalWeapon("images/special-wpn.png", null, this.gameView, 140, 700);

        this.enemyBoss = new EnemyBoss(this.gameView, "images/enemy-boss.png", platformBoss);
        this.enemies.push(this.enemyBoss, magicWeapon1, magicWeapon2);

        // start boss movement
        this.enemyBoss.positionX = 1;
        

        let frames = 0;
        const intervalId = setInterval(() => {

            frames += 1;

            // action for weapons, throw at regular intervals
            if (frames % 250 === 0 && !this.player.died) {
                magicWeapon1.throw(this.player);
            }
            else if (frames % 400 === 0 && !this.player.died) {
                magicWeapon2.throw(this.player);
            }

            // render everything
            this.player.renderPlayer();
            this.enemies.forEach(enemy => {
                enemy.render();
            });

            // randomize movement for enemy 
            if (
                frames % 100 === 0 && !this.enemyBoss.died &&
                this.enemyBoss.left > platformBoss.left + 10 &&
                this.enemyBoss.left < platformBoss.left + platformBoss.width - 10
            ) {
                const changeDirection = Math.random();
                if (changeDirection > 0.5) {
                    if (this.enemyBoss.positionX = 1) {
                        this.enemyBoss.positionX = -1;
                    }
                    else {
                        this.enemyBoss.positionX = 1;
                    }
                }
            }

            // check collision with enemy and player weapon
            if (this.enemyBoss.gotHit(this.player.weapon)) {
                this.enemyBoss.respawn();
            }

            // check collison with enemy weapons and player
            if (!this.player.died) {
                if (
                    magicWeapon1.weaponHit(this.player.element) || 
                    magicWeapon2.weaponHit(this.player.element)
                ) {
                    this.player.died = true;
                    this.player.respawn();
                }
            }

            // check game over, cleanup everything, show appropriate end screen
            if (this.enemyBoss.lives === 0 || this.player.lives === 0) {
                clearInterval(intervalId);
                this.restart();
                
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


    // show on death
    showDeathView() {
        this.gameView.style.display = "none";
        this.deathView.style.display = "block";
        setTimeout(() => {
            this.deathView.style.display = "none";
            this.endView.style.display = "flex";
        }, 3000)
    }

    // show view for winning game
    showVictoryView() {
        this.gameView.style.display = "none";
        this.victoryView.style.display = "flex"
        setTimeout(() => {
            this.victoryView.style.display = "none";
            this.endView.style.display = "flex";
        }, 5000)
    }

    // introduction in between levels
    levelTransition(imageSrc, level) {
        this.gameView.style.display = "none";
        const transitionImg = document.getElementById("transition-img");
        transitionImg.src = imageSrc;

        const transitionText = document.getElementById("transition-text");

        if (level === 1) {
            transitionText.innerHTML = `
            <strong>WHAT'S THIS!?</strong> It looks like the one who kidnapped the 
            princess was your <strong>TWIN BROTHER!</strong> He made a deal with the 
            demons to kidnap her in exhange for dark magical powers. You have to stop him!<br>
            <br>
            (Use O or P to throw your weapon UP)
            `;
        }
        this.transitionView.style.display = "flex";
    }

    // go to next level on click of button
    nextLevel(level) {
        this.transitionView.style.display = "none";
        this.gameView.style.display = "block";
        if (level === 1) {
            this.bossLevel();
        }
    }
}