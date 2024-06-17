class Player {
    constructor(gameView, platforms) {
        this.gameView = gameView;
        // temporary solution //////////
        this.platforms = platforms;
        ///////////////////////////////
        this.width = 28;
        this.height = 64;
        
        // keep track of starting location
        this.startTop = 380;
        this.startLeft = 50;

        this.died = false;
        this.lives = 5;

        this.top = this.startTop;
        this.left = this.startLeft;

        this.element = document.createElement("div");
        this.image = document.createElement("img");

        this.speed = 4;
        this.positionX = 0;


        // jump -> use velocity and gravity to determine speed of fall
        this.jumpSpeed = 9;      
        this.jumping = false;
        this.velocity = 0;
        this.falling = false;
        this.standing = false;
        this.positionY = 0;    // unused
        // (!) use positionY to determine falling/standing/jumping
        
        // set the player rectangle slightly less wide than actual image, 
        // to account for parts of image sticking out
        this.image.src = "images/player-char.png";
        this.image.classList.add("player-char-img");

        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.top = `${this.top}px`;
        this.element.style.left = `${this.left}px`;
        this.element.classList.add("player-char");

        this.element.appendChild(this.image);
        this.gameView.appendChild(this.element);

        this.weapon = new PlayerWeapon("images/player-wpn.png", this, this.gameView);

    }

    // (!)check if player is standing in central location

    move() {
        console.log("move");
        // move horizontal
        if (!this.died) {
            // jump
            
            // currently jumping
            // while velocity is negative, -> character moves up
            if (this.jumping) {
                // add gravity to velocity, add velocity to top (y position)
                this.top += this.velocity;
                this.velocity += GRAVITY;
                // when velocity reaches 0, start falling
                if (this.velocity >= 0) {
                    this.jumping = false;
                }
            }
            else {
                // if not standing on platform, add gravity to velocity, add to top
                const platform = this.isStandingOnPlatform(this.platforms);
                if (!platform) {
                    this.standing = false;
                    this.velocity += GRAVITY;
                    if (this.velocity > TERMINAL_VELOCITY) {
                        this.velocity = TERMINAL_VELOCITY; 
                    }
                    this.top += this.velocity;
                    // take away control of player when falling too long
                    if (this.velocity > this.jumpSpeed) {
                        this.falling = true;
                    }
                    
                }
                else {
                    // if standing, set velocity to 0
                    this.standing = true;
                    this.falling = false;
                    this.velocity = 0;
                    // set player character correctly on top of platform
                    this.top = parseFloat(platform.element.style.top) - this.height - 1;
                }
            }
            
            // possible solution -> prevent movement when falling
            if (!this.falling) {
                this.left += this.positionX * this.speed;
            }

            // keep player in bounds of game view
            if (this.left < 3) {
                this.left = 3;
            }

            if (this.left > this.gameView.clientWidth - this.width) {
                this.left = this.gameView.clientWidth - this.width;
            }

            // check if player fell out of bounds (in game class)
            if (this.top > this.gameView.clientHeight + 20) {
                this.died = true;
                this.respawn();
            } 
        }  
    }

    jump() {
        console.log("jump");

        // can only jump if not currently jumping and standing on platform
        if (!this.jumping && !this.falling && this.standing) {
            this.jumping = true;
            this.standing = false;
            //this.falling = false;
            this.velocity = -this.jumpSpeed;
            //this.positionY = this.top;
        }
    }

    // check if char is currently standing on a platform
    isStandingOnPlatform(platforms) {
        // compare bounds of player to each platform on screen
        const playerRect = this.element.getBoundingClientRect();

        //console.log("Player: ", playerRect);

        for (let platform of platforms) {
            const platformRect = platform.element.getBoundingClientRect();

            //console.log("Platform :", platformRect);

            // detect collision with top of platform, allow some margin
            if (
                playerRect.bottom <= platformRect.top + 5 &&
                playerRect.bottom >= platformRect.top - 5 &&
                playerRect.right >= platformRect.left &&
                playerRect.left <= platformRect.right
            ) {
                return platform;
            }
        }
        return null;
    }

    respawn() {

        if (this.lives > 0) {
        
            const livesElements = document.querySelectorAll(".life");
            
            livesElements[this.lives - 1].remove();

            this.lives -= 1;
            this.element.style.display = "none";
            this.top = this.startTop;
            this.left = this.startLeft;
            let flashCount = 0;
            const flashInterval = setInterval(() => {
                if (this.element.style.display === "none") {
                    this.element.style.display = "block";
                }
                else {
                    this.element.style.display = "none";
                }

                flashCount += 1;

                if (flashCount >= 6) {
                    this.element.style.display = "block";
                    this.died = false;
                    clearInterval(flashInterval);
                }
            }, 300);
        }
    }

    renderPlayer() {
        // update position of element
        this.move();
        this.element.style.top = `${this.top}px`;
        this.element.style.left = `${this.left}px`;
    }
        
}

/*
position: absolute;
width: 35px;
height: 64px;
border: 2px solid red;
top: 400px; 
left: 100px; */