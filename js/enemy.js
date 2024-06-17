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

        this.positionX = 0;
        this.speed = 2;

        this.died = false; //(!) used in game class

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


class ThrowingEnemy extends BasicEnemy {
    constructor(gameView, imageSrc, platform) {
        super(gameView, imageSrc, platform)
        this.speed = 0;
        this.weapon = new EnemyWeapon("images/enemy-wpn.png", this, this.gameView);
    }

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