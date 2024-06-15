class Player {
    constructor(gameView, platforms) {
        this.gameView = gameView;
        // temporary solution //////////
        this.platforms = platforms;
        ///////////////////////////////
        this.width = 28;
        this.height = 64;
        this.top = 400;
        this.left = 100;
        this.element = document.createElement("div");
        this.image = document.createElement("img");

        this.speed = 4;
        this.positionX = 0;

        //this.jumpHeight = 64;
        //this.jumpStartPosition = 0;
        //this.positionY = 0;

        // jump -> use velocity and gravity to determine speed of fall
        this.jumpSpeed = 10;      
        this.jumping = false;
        this.velocity = 0;
        
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

    }

    move() {
        console.log("move");
        // move horizontal
        this.left += this.positionX * this.speed;
        
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
            if (!this.isStandingOnPlatform(this.platforms)) {
                this.velocity += GRAVITY;
                this.top += this.velocity;
            }
            else {
                // if standing, set velocity to 0
                this.velocity = 0;
            }
        }
        

        
        // keep player in bounds of game view
        if (this.left < 3) {
            this.left = 3;
        }

        if (this.left > this.gameView.clientWidth - this.width) {
            this.left = this.gameView.clientWidth - this.width;
        }

        // update position of element
        this.element.style.top = `${this.top}px`;
        this.element.style.left = `${this.left}px`;
    }

    jump() {
        console.log("jump");

        // can only jump if not currently jumping and standing on platform
        if (!this.jumping && this.isStandingOnPlatform(this.platforms)) {
            this.jumping = true;
            this.velocity = -this.jumpSpeed;
        }
    }
    ///////////(!) char falls through platform if falling from great heights/////////
    
    // check if char is currently standing on a platform
    isStandingOnPlatform(platforms) {
        // compare bounds of player to each platform on screen
        const playerRect = this.element.getBoundingClientRect();

        console.log("Player: ", playerRect);

        for (let platform of platforms) {
            const platformRect = platform.element.getBoundingClientRect();

            console.log("Platform :", platformRect);

            // detect collision with top of platform, allow some margin
            if (
                playerRect.bottom <= platformRect.top + 3 &&
                playerRect.bottom >= platformRect.top - 3 &&
                playerRect.right >= platformRect.left &&
                playerRect.left <= platformRect.right
            ) {
                console.log("Collision platform: ", platformRect);
                console.log("Collision player: ", playerRect);
                return true;
            }
        }
        return false;
    }
        
}

/*
position: absolute;
width: 35px;
height: 64px;
border: 2px solid red;
top: 400px; 
left: 100px; */