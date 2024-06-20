const GRAVITY = 0.6;
const TERMINAL_VELOCITY = 10;

class Game {
    constructor(playerSounds, gameSounds) {
        // on screen elements
        this.splashView = document.getElementById("splash-view");
        this.gameView = document.getElementById("game-view");
        this.endView = document.getElementById("end-view");
        this.deathView = document.getElementById("death-view");
        this.victoryView = document.getElementById("victory-view");
        this.transitionView = document.getElementById("transition-view");

        // game audio
        this.playerSounds = playerSounds;
        this.gameSounds = gameSounds;

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
        this.endLevel = false;
        
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
        this.platforms.push(
            new Platform(this.gameView, 150, 470, 0),
            new Platform(this.gameView, 50, 410, 170),
            new Platform(this.gameView, 250, 350, 250),

            new Platform(this.gameView, 250, 290, 520),
            new Platform(this.gameView, 75, 230, 800),
            new Platform(this.gameView, 300, 200, 400),

            new Platform(this.gameView, 95, 200, 210),
            new Platform(this.gameView, 100, 150, 100),
            new Platform(this.gameView, 350, 100, 250),

            new EndPlatform(this.gameView),
        );

        // create enemies
        this.enemies.push(
            new BasicEnemy(this.gameView, "images/basic-enemy-ninja-1.png", this.platforms[5]), 
            new BasicEnemy(this.gameView, "images/basic-enemy-ninja-3.png", this.platforms[2]), 
            new BasicEnemy(this.gameView, "images/basic-enemy-ninja-2.png", this.platforms[3]), 
            new ThrowingEnemy(this.gameView, "images/throwing-enemy-ninja.png", this.platforms[7]),
        );

        this.enemies[0].positionX = 1;
        this.enemies[1].positionX = -1;
        this.enemies[2].positionX = 1;

        this.enemies[3].left -= 42;
        this.enemies[3].element.style.left = `${this.enemies[3].left}px`;

        // create player                        
        this.player = new Player(this.gameView, this.platforms, this.playerSounds);
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

            // render player
            this.player.renderPlayer();
          
            // render enemy weapon, throw at regular intervals
            this.enemies[3].weapon.render();
            if (frames % 250 === 0 && !this.player.died) {

                // only throw if owner didn't die
                if (!this.enemies[3].died) {
                    this.enemies[3].weapon.throw(this.player);
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
                    enemy.element.remove();
                }
            });

            
            // detect collision for enemy weapon
            if (this.enemies[3].weaponHit(this.player.element)) {
                this.player.died = true;
                this.player.respawn();
            }

            // check for game over / passed level
            if (this.player.lives === 0 || this.platforms[this.platforms.length - 1].passedLevel(this.player.element)) {
                clearInterval(intervalId);

                if (this.player.lives === 0) {
                    this.gameOver = true;
                }

                // remove all enemies, player, platforms
                this.enemies[3].weapon.element.remove();
                this.enemies[3].weapon.image.remove();
                this.restart();
                
                // go to level transition or death view
                if (!this.gameOver) {
                    this.level = 1;
                    this.levelTransition("images/enemy-sumo.png", this.level);
                }
                else {
                    this.showDeathView();
                }
            }
        }, 1000 / 60);
    }


    levelTwo() {

        // create platforms
        // moving platforms need 'isVertical' and borders between which it moves
        // add to array
        this.platforms.push(
            new Platform(this.gameView, 150, 470, 15),
            new MovingPlatform(this.gameView, 100, 420, 185, true, {"start": 470,"end": 300}),

            new Platform(this.gameView, 150, 270, 15),
            new MovingPlatform(this.gameView, 100, 220, 285, false, {"start": 219,"end": 305}),

            new Platform(this.gameView, 200, 130, 495),
            new MovingPlatform(this.gameView, 50, 170, 420, true, {"start": 270, "end": 150}),

            new Platform(this.gameView, 125, 410, 700),
            new EndPlatform(this.gameView),
        );

        this.platforms[1].positionY = -1;
        this.platforms[3].positionX = 1;
        this.platforms[5].positionY = 1;

        // create enemies
        this.enemies.push(
            new BasicEnemy(this.gameView, "images/basic-enemy-judo.png", this.platforms[2]),
            new MiniBoss(this.gameView, "images/enemy-sumo.png", this.platforms[4]),
            new FlyingEnemy(this.gameView, "images/flying-enemy-judo.png", this.platforms[6])
        );

        this.enemies[0].positionX = -1;
        this.enemies[1].positionX = 1;
        this.enemies[2].positionX = -1;

        // create player
        this.player = new Player(this.gameView, this.platforms, this.playerSounds);
        this.displayPlayerLives();

        let frames = 0;
        let enemyReturnTimout = false;
        let timeOutId;

        // game loop
        const intervalId = setInterval(() => {

            frames += 1; 

            // fly enemy toward player if player top is high enough
            if (frames % 300 === 0 && this.player.top < 270) {
                // check if flying enemy is in game
               if (!this.enemies[2].died) {
                this.enemies[2].fly(this.player);
               }
            }
            
            this.player.renderPlayer();

            this.platforms.forEach(platform => {
                if (platform instanceof MovingPlatform) {
                    platform.move();
                }
            });

            // render enemies, detect collision
            this.enemies.forEach(enemy => {
                
                enemy.render();

                if (enemy.didCollide(this.player.element)) {
                    this.player.died = true;
                    this.player.respawn();
                }
                else if (enemy.gotHit(this.player.weapon)) {
                    if (enemy instanceof MiniBoss) {
                        enemy.respawn();
                    }
                    else {
                        enemy.died = true;
                        enemy.element.remove();
                        if (enemy instanceof FlyingEnemy) {
                            enemy.return();
                        }
                    }
                }
            });
            

            if (this.enemies[1].lives === 0) {
                this.enemies[1].died = true;
                this.enemies[1].element.remove();
                this.enemies[1].livesContainer.remove();
            }

            // check for game over / passed level
            if (this.player.lives === 0 || this.platforms[this.platforms.length - 1].passedLevel(this.player.element)) {
                clearInterval(intervalId);

                // clear timeout for respawning enemy
                if (this.enemies[2].timeoutId !== null) {
                    clearTimeout(this.enemies[2].timeoutId);
                }

                if (this.player.lives === 0) {
                    this.gameOver = true;
                }

                // remove all enemies, player, platforms
                this.restart();
                
                // go to level transition or death view
                if (!this.gameOver) {
                    this.level = 2;
                    this.levelTransition("images/demon-1.png", this.level);
                }
                else {
                    this.showDeathView();
                }
            }
        }, 1000 / 60);
    }


    levelThree() {

        // create platforms
        this.platforms.push(
            new Platform(this.gameView, 150, 470, 15),
            new MovingPlatform(this.gameView, 210, 410, 200, false, {"start": 200, "end": 400}),

            new Platform(this.gameView, 75, 350, 620),
            new MovingPlatform(this.gameView, 150, 220, 20, true, {"start": 270, "end": 120}),

            new MovingPlatform(this.gameView, 220, 100, 200, false, {"start": 200, "end": 400}),

            new EndPlatform(this.gameView),
        );

        this.platforms[1].positionX = -1;
        this.platforms[3].positionY = -1;

        this.platforms[4].positionX = 1;
        this.platforms[4].speed = 1.5;


        this.platforms[1].speed = 2;
        this.platforms[3].speed = 2;

        // change Y of moving platform
        const position1 = 410
        const position2 = 290
        //const position3 = 100

        // change position of platform at at regular interval
        const platformInterval = setInterval(() => {
            if (this.platforms[1].top === position1) {
                this.platforms[1].top = position2;
            }
            /*
            else if (this.platforms[1].top === position2) {
                this.platforms[1].top = position3;
            }
                */
            else {
                this.platforms[1].top = position1;
            }
        }, 5000);

        
        // create enemies
        this.enemies.push(
            new FloatingEnemy(this.gameView, "images/demon-1.png", 75, 500,
                {"start": 220, "end": 600},
                {"start": 105, "end": 25}
            ),
            new FloatingEnemy(this.gameView, "images/demon-2.png", 250, 100, 
                {"start": 70, "end": 200},
                {"start": 270, "end": 100}
            ),
            new FloatingEnemy(this.gameView, "images/demon-3.png", 200, 700,
                {"start": 650, "end": 800},
                {"start": 255, "end": 130}
            ),
        );

        this.enemies[0].positionX = -1;
        this.enemies[0].positionY = 1;

        this.enemies[1].positionX = 1;
        this.enemies[1].positionY = -1;

        this.enemies[2].positionX = -1;
        this.enemies[2].positionY = 1;

        // create player
        // display lives
        this.player = new Player(this.gameView, this.platforms, this.playerSounds);
        this.displayPlayerLives();

        // game loop
        const intervalId = setInterval(() => {

            this.enemies.forEach(enemy => {
                enemy.render();

                if (enemy.didCollide(this.player.element)) {
                    this.player.died = true;
                    this.player.respawn();
                }
                else if (enemy.gotHit(this.player.weapon)) {
                    enemy.died = true;
                    enemy.element.remove();
                }
            });

            this.platforms.forEach(platform => {
                if (platform instanceof MovingPlatform) {
                    platform.move();
                }
            });

            this.player.renderPlayer();

             // check for game over / passed level
             if (this.player.lives === 0 || this.platforms[this.platforms.length - 1].passedLevel(this.player.element)) {
                clearInterval(intervalId);
                clearInterval(platformInterval);

                if (this.player.lives === 0) {
                    this.gameOver = true;
                }

                // remove all enemies, player, platforms
                this.restart();
                
                // go to level transition or death view
                if (!this.gameOver) {
                    this.level = 3;
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
        this.gameView.classList.add("boss-level");
        this.endLevel = true;

        // create platforms
        this.platforms.push(
            new Platform(this.gameView, 150, 470, 15),
            new Platform(this.gameView, 200, 420, 215),
            new Platform(this.gameView, 150, 470, 465),
            new Platform(this.gameView, 200, 420, 665),
            new Platform(this.gameView, 700, 100, 100),
        );

        // create player, display lives
        this.player = new Player(this.gameView, this.platforms, this.playerSounds);
        this.displayPlayerLives();

        // create boss and enemies
        this.enemyBoss = new EnemyBoss(this.gameView, "images/enemy-boss.png", this.platforms[this.platforms.length - 1]);

        this.enemies.push(
            new MagicalWeapon("images/special-wpn.png", this.gameView, 140, 120),
            new MagicalWeapon("images/special-wpn.png", this.gameView, 140, 700),
        );

        // start boss movement
        this.enemyBoss.positionX = 1;
        
        // game loop
        let frames = 0;
        const intervalId = setInterval(() => {

            frames += 1;

            // action for weapons, throw at regular intervals
            if (frames % 250 === 0 && !this.player.died) {
                this.enemies[0].throw(this.player);
            }
            else if (frames % 400 === 0 && !this.player.died) {
                this.enemies[1].throw(this.player);
            }

            // render everything
            this.player.renderPlayer();
            this.enemyBoss.render();
            this.enemies.forEach(enemy => {
                enemy.render();
            });

            // randomize movement for enemy 
            if (
                frames % 100 === 0 && !this.enemyBoss.died &&
                this.enemyBoss.left > this.platforms[4].left + 10 &&
                this.enemyBoss.left < this.platforms[4].left + this.platforms[4].width - 10
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
                    this.enemies[0].weaponHit(this.player.element) || 
                    this.enemies[1].weaponHit(this.player.element)
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
            this.enemyBoss.element.remove();
            this.enemyBoss = null;
        }
        this.platforms.forEach(platform => {
            platform.element.remove();
            platform = null
        });
        this.platforms = [];
        
        this.enemies.forEach(enemy => {
            if (enemy.weapon) {
                enemy.weapon.element.remove();
            }
            if (enemy.image) {
                enemy.image.remove();
            }
            enemy.element.remove();
            enemy = null
        });
        this.enemies = [];

        if (this.livesElements.length > 0) {
            this.livesElements.forEach(item => {
                item.remove();
                
            });
            this.livesElements = [];
        }
        this.player.weapon.image.remove();
        this.player.weapon.element.remove();
        this.player.image.remove();
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
            <strong>WATCH OUT!</strong> The local martial arts champions have teamed up with 
            the enemy ninjas, and are trying to stop you from reaching the princess.
            Who could have caused this betrayal?<br> Keep your eyes open!
            `;
        }
        else if (level === 2) {
            transitionText.innerHTML = `
            <strong>CAREFUL!</strong> Someone is using dark magic to summon demons and curse the platforms.
            This is getting dangerous!<br>There must be some powerful force behind this conspiracy...
            `;
        }
        else if (level === 3) {
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
            this.levelTwo();
        }
        else if (level === 2) {
            this.levelThree();
        }
        else if (level === 3) {
            this.bossLevel();
        }
    }
}