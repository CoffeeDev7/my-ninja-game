class Enemy {
    constructor(gameView, imageSrc) {

        this.gameView = gameView
        this.element = document.createElement("img");
        this.element.src = imageSrc;

        this.element.classList.add("enemy");
        this.gameView.appendChild(this.element);

        
    }
}

class BasicEnemy extends Enemy {
    constructor(gameView, imageSrc, platform) {
        super(gameView, imageSrc)
        this.top = platform.top - 64;
        this.left = platform.left + 64;
        this.width = 64;
        this.height = 64;
        this.platform = platform;
        this.facingRight = true;

        this.positionX = 0;
        this.speed = 2;

        this.died = false;

        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.top = `${this.top}px`;
        this.element.style.left = `${this.left}px`;

        // speed
    }

    // movement
    move() {

        if (this.positionX === 1) {
            this.element.classList.remove("flip-image");
        }
        else {
            this.element.classList.add("flip-image");
        }

        this.left += this.positionX * this.speed;

        if (this.left < this.platform.left) {
            this.positionX = 1;  
        }

        if ((this.left + this.width) > (this.platform.left + this.platform.width)) {
            this.positionX = -1;  
        }

        this.element.style.left = `${this.left}px`;
    }
    // rendering
    // collision detection
    didCollide(player) {
        
    }

    gotHit(playerWeapon) {

    }
}