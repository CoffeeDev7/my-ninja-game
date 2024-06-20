class Enemy {
    constructor(gameView, imageSrc) {

        this.gameView = gameView
        this.element = document.createElement("img");
        this.element.src = imageSrc;

        this.imageSrc = imageSrc;                // needed for flying enemy, might change

        this.element.classList.add("enemy");
        this.gameView.appendChild(this.element);
        
    }
}

class BasicEnemy extends Enemy {
    constructor(gameView, imageSrc, platform = null) {
        super(gameView, imageSrc)
        // ensure enemy types without platform can inherit from this class
        if (platform) {
            this.top = platform.top - 64;
            this.left = platform.left + 64;
        }
        else {
            this.top = 0;
            this.left = 0;
        }
        this.width = 64;
        this.height = 64;
        this.platform = platform;

        this.positionX = 0;
        this.speed = 2;

        this.died = false; //(!) used in game class

        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.top = `${this.top}px`;
        this.element.style.left = `${this.left}px`;
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
    }

    // rendering
    render() {
        this.move();
        this.element.style.left = `${this.left}px`;
    }

    // collision detection (enemy hit player)
    didCollide(player) {
        const playerRect = player.getBoundingClientRect();
        const enemyRect = this.element.getBoundingClientRect();

        if (
            playerRect.left < enemyRect.right &&
            playerRect.right > enemyRect.left &&
            playerRect.top < enemyRect.bottom &&
            playerRect.bottom > enemyRect.top
        ) {
            return true;
        }
        
        return false;
    }

    // (enemy got hit by player weapon)
    gotHit(playerWeapon) {
        const weaponRect = playerWeapon.element.getBoundingClientRect();
        const enemyRect = this.element.getBoundingClientRect();

        if (
            weaponRect.left < enemyRect.right &&
            weaponRect.right > enemyRect.left &&
            weaponRect.top < enemyRect.bottom &&
            weaponRect.bottom > enemyRect.top
        ) {
            playerWeapon.returnWeapon();
            return true;
        }
        
        return false;
    }
}


// throwing enemy doesn't move
class ThrowingEnemy extends BasicEnemy {
    constructor(gameView, imageSrc, platform) {
        super(gameView, imageSrc, platform)
        this.speed = 0;
        this.weapon = new EnemyWeapon("images/enemy-wpn.png", this, this.gameView);
    }

    // check if enemy weapon hit player
    weaponHit(playerElement) {
        const playerRect = playerElement.getBoundingClientRect();
        const weaponRect = this.weapon.element.getBoundingClientRect();

        if (
            playerRect.left < weaponRect.right &&
            playerRect.right > weaponRect.left &&
            playerRect.top < weaponRect.bottom &&
            playerRect.bottom > weaponRect.top
        ) {
            this.weapon.returnWeapon();
            return true;
        }
        return false;
    }
}


// has lives and can respawn
class EnemyBoss extends BasicEnemy {
    constructor(gameView, imageSrc, platform) {
        super(gameView, imageSrc, platform)
        this.speed = 3;
        this.lives = 5;
        this.livesContainer = document.createElement("div");
        this.livesContainer.classList.add("boss-lives");

        for (let i = 0; i < this.lives; i++) {
            const lifeElement = document.createElement("div");
            lifeElement.classList.add("boss-life");
            lifeElement.classList.add("life");
            this.livesContainer.appendChild(lifeElement);
        }

        this.livesContainer.style.top = `${this.top - 10}px`;
        this.livesContainer.style.left = `${this.left}px`;

        this.gameView.appendChild(this.livesContainer);

        this.lifeElements = document.querySelectorAll(".boss-life");
    }

    render() {
        this.move();
        this.element.style.left = `${this.left}px`;
        this.livesContainer.style.top = `${this.top - 10}px`;
        this.livesContainer.style.left = `${this.left}px`;
    }

    respawn() {
        if (!this.died) {

            this.lifeElements[this.lives - 1].remove();

            this.died = true;
            this.positionX = 0;
            this.element.style.display = "none";
            this.lives -= 1;

            // respawn in random position on platform
            const maxLeft = 600;
            const minLeft = 120;
            this.left = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;

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
                    this.positionX = 1;
                    clearInterval(flashInterval);
                }
            }, 300);
        }
    }
}


class MiniBoss extends BasicEnemy {
    constructor(gameView, imageSrc, platform) {
        super(gameView, imageSrc, platform)
        this.speed = 1;
        this.lives = 3;
        this.jumpHeight = 25;
        this.jumpSpeed = 2;
        this.positionY = 0;
        this.startTop = this.top;

        this.livesContainer = document.createElement("div");
        this.livesContainer.classList.add("boss-lives");

        for (let i = 0; i < this.lives; i++) {
            const lifeElement = document.createElement("div");
            lifeElement.classList.add("boss-life");
            lifeElement.classList.add("life");
            this.livesContainer.appendChild(lifeElement);
        }

        this.livesContainer.style.top = `${this.top - 10}px`;
        this.livesContainer.style.left = `${this.left}px`;

        this.gameView.appendChild(this.livesContainer);

        this.lifeElements = document.querySelectorAll(".boss-life");
    }

    move() {
        // move x axis
        this.left += this.positionX * this.speed;

        // bounce
        this.top += this.positionY * this.jumpSpeed;
        
        // only bounce when hitting the border of platform
        if (this.left < this.platform.left) {
            this.positionX = 1;
            if (this.top === this.startTop) {
                this.positionY = -1; 
            } 
        }

        if ((this.left + this.width) > (this.platform.left + this.platform.width)) {
            this.positionX = -1; 
            if (this.top === this.startTop) {
                this.positionY = -1; 
            } 
        }

        if (this.top < this.startTop - this.jumpHeight) {
            this.positionY = 1;
        }

        if (this.top > this.startTop) {
            this.positionY = 0;
            this.top = this.startTop;
        }
    }

    render() {
        this.move();
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;
        this.livesContainer.style.top = `${this.top - 10}px`;
        this.livesContainer.style.left = `${this.left + 10}px`;
    }

    respawn() {
        if (!this.died) {

            this.lifeElements[this.lives - 1].remove();

            this.died = true;
            this.positionX = 0;
            this.positionY = 0;
            this.element.style.display = "none";
            this.lives -= 1;

            this.top = this.startTop;

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
                    this.positionX = 1;
                    clearInterval(flashInterval);
                }
            }, 300);
        }
    }
}


class FlyingEnemy extends BasicEnemy {
    constructor(gameView, imageSrc, platform) {
        super(gameView, imageSrc, platform)
        this.flying = false;
        this.positionY = 0;
        this.startTop = this.top;
        this.startLeft = this.left;
        this.timeoutId = null;
    }

    fly(player) {
        
        if (!this.flying) {
            this.flying = true;
            this.element.classList.add("flip-image")
            this.speed = 2.5;

            const playerPosition = {
                "positionX": player.left,
                "positionY": player.top + 32,
            };

            const direction = {
                "directionX": playerPosition.positionX - this.left,
                "directionY": playerPosition.positionY - this.top,
            };

            // get distance between 2 points by getting square root of (a^2 + b^2)
            const distance = Math.sqrt(direction.directionX ** 2 + direction.directionY ** 2);

            // unit vector to ensure weapons travels in constant speed regardless of distance
            this.positionX = direction.directionX / distance;
            this.positionY = direction.directionY / distance;

        }
    }

    return() {
        
        this.top = this.startTop;
        this.left = this.startLeft;
        this.flying = false;
        this.positionY = 0;
        this.positionX = 1;
        this.died = false;

        // recreate element
        this.element = document.createElement("img");
        this.element.src = this.imageSrc;
        this.element.classList.add("enemy");

        this.timeoutId = setTimeout(() => {
            this.gameView.appendChild(this.element);
        }, 2000);
    }

    render() {
        if (!this.flying) {
            this.move();
        }
        else {
            this.left += this.positionX * this.speed;
            this.top += this.positionY * this.speed;
            const gameViewRect = this.gameView.getBoundingClientRect();
            const enemyRect = this.element.getBoundingClientRect();


            // check if enemy is off screen
            if (
                enemyRect.left < gameViewRect.left ||
                enemyRect.top > gameViewRect.bottom || 
                enemyRect.top < gameViewRect.top
            ) {
                this.element.remove();
                this.died = true;
                this.return();
            }
        }
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;
    }
}


// floating enemy
/*
1. set start position (top, left),
2. set borders in which it can move xAxis = {start, end}, yAxis = {start, left}
*/
class FloatingEnemy extends BasicEnemy {
    constructor(gameView, imageSrc, top, left, xAxis, yAxis) {
        super(gameView, imageSrc)
        this.top = top;
        this.left = left;
        this.xAxis = xAxis;
        this.yAxis = yAxis;

        this.speed = 1;

        delete this.platform;

        this.positionY = 0;
    }

    move() {
        this.top += this.positionY * this.speed;
        this.left += this.positionX * this.speed;

        if (this.left < this.xAxis.start) {
            this.positionX = 1;
        }
        else if (this.left > this.xAxis.end) {
            this.positionX = -1;
        }

        if (this.top < this.yAxis.end) {
            this.positionY = 1;
        }
        else if (this.top > this.yAxis.start) {
            this.positionY = -1;
        }

    }
    render() {
        this.move();
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;
    }
}