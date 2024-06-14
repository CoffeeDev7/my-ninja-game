class Player {
    constructor(gameView, platforms) {
        this.gameView = gameView;
        // temporary solution //////////
        this.platforms = platforms;
        ///////////////////////////////
        this.width = 35;
        this.height = 64;
        this.top = 400;
        this.left = 100;
        this.element = document.createElement("div");
        this.image = document.createElement("img");

        this.speed = 4;
        this.positionX = 0;

        this.jumpHeight = 64;
        this.jumpSpeed = 7;
        this.jumpStartPosition = 0;
        this.positionY = 0;

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
        this.left += this.positionX * this.speed;
        // jump
        
        // create seperate logic for jumping / falling

        if (this.positionY < 0) {
            this.top += this.positionY * this.jumpSpeed;
            this.jumpStartPosition += this.jumpSpeed;
            if (this.jumpStartPosition >= this.jumpHeight) {
                this.positionY = 1
            }
        }

         /// temporary solution. should have gravity pull down character more
        if (this.positionY > 0) {
            this.top += this.positionY * GRAVITY;
        }

        if (this.isStandingOnPlatform(this.platforms)) {
            this.positionY = 0;
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
        // should know initial position
        // know if player is currently jumping or falling

        // if positionY = 0 -> standing, -1 -> jumping, 1 -> falling

        if (this.positionY === 0) {
            this.positionY = -1;
            this.jumpStartPosition = 0;
        }
    }

    // check if char is currently standing on a platform
    //////// issue -> need to specify which platform (?) ///////////////////
    isStandingOnPlatform(platforms) {
        const playerRect = this.element.getBoundingClientRect();

        for (let platform of platforms) {
            const platformRect = platform.element.getBoundingClientRect();
            if (
                playerRect.bottom <= platformRect.top + 2 &&
                playerRect.bottom >= platformRect.top - 2 &&
                playerRect.right >= platformRect.left &&
                platformRect.left <= platformRect.right
            ) {
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