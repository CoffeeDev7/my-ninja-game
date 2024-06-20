class Weapon {
    constructor(imageSrc, owner = null, gameView) {
        if (owner) {
            this.owner = owner;
            this.top = this.owner.top + 25;
            this.left = this.owner.left;
        }
        else {
            this.top = 0;
            this.left = 0;
        }
        this.thrown = false;
        this.speed = 6;
        this.positionX = 0;
        this.positionY = 0;

        this.gameView = gameView;

        this.width = 32;
        this.height = 32;
        
        
        this.element = document.createElement("div");
        this.image = document.createElement("img");

        this.image.src = imageSrc;
        this.image.classList.add("weapon-img");

        this.element.classList.add("weapon-element");
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.top = `${this.top}px`;
        this.element.style.left = `${this.left}px`;

        this.element.appendChild(this.image);
        this.gameView.appendChild(this.element);
    }
}

class PlayerWeapon extends Weapon {
    constructor(imageSrc, owner, gameView) {
        super(imageSrc, owner, gameView);
        this.element.style.display = "none";
        this.thrownUpwards = false;
    }

    throw(direction) {
        // only allow throw when player didn't die 
        if (!this.owner.died) {

            // if not yet thrown, make visible, set in motion.
            if (!this.thrown) {
                this.thrown = true;
                

                this.positionY = this.owner.top + 25;
                this.left = this.owner.left;

                this.element.style.display = "block";

                if (direction === "left") {
                    this.positionX = -1
                }
                else if (direction === "right") { 
                    this.positionX = 1;
                }
            }
        }
    }

    // special throw for final level
    throwUp() {
        if (!this.owner.died) {

            if (!this.thrown) {
                this.thrown = true;
                this.thrownUpwards = true;
                

                this.positionX = this.owner.left;
                this.top = this.owner.top;

                this.positionY = -1;

                this.element.style.display = "block";

            }
        }
    }

    // render weapon
    render() {

        // if thrown, keep going in straight line
        if (this.thrown) {
            
            if (this.thrownUpwards) {
                this.left = this.positionX;
                this.top += this.positionY * this.speed;
            }
            else {
                this.left += this.positionX * this.speed;
                this.top = this.positionY;
            }

            const gameViewRect = this.gameView.getBoundingClientRect();
            const weaponRect = this.element.getBoundingClientRect();
   

            // check if weapon is off screen
            if (weaponRect.left < gameViewRect.left || weaponRect.right > gameViewRect.right
                || weaponRect.top < gameViewRect.top 
            ) {
                // return weapon
                this.returnWeapon();
            }
        }
        // if not thrown, keep weapon behind player
        else {
            this.left = this.owner.left;
            this.top = this.owner.top + 25;
        }
        
        // update weapon position
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`
        
    }

    // return weapon back to player
    returnWeapon() {
        this.element.style.display = "none";
        this.left = this.owner.left;
        this.top = this.owner.top + 25;

        this.thrown = false;
        this.thrownUpwards = false;

        this.positionX = 0;
        this.positionY = 0;
    }
}


class EnemyWeapon extends Weapon {
    constructor(imageSrc, owner, gameView) {
        super(imageSrc, owner, gameView);
        this.element.style.display = "none";
    }
    // only allow throw when not yet thrown
    throw(player) {
        if (!this.thrown) {

            this.element.style.display = "block";
            this.thrown = true;

            // get player's current location (x, y)
            const playerPosition = {
                "positionX": player.left,
                "positionY": player.top + 32,
            };

            // determine direction by getting the difference between owner and player's (x, y) coords
            const direction = {
                "directionX": playerPosition.positionX - this.owner.left,
                "directionY": playerPosition.positionY - this.owner.top,
            };

            // get distance between 2 points by getting square root of (a^2 + b^2)
            const distance = Math.sqrt(direction.directionX ** 2 + direction.directionY ** 2);

            // unit vector to ensure weapons travels in constant speed regardless of distance
            this.positionX = direction.directionX / distance;
            this.positionY = direction.directionY / distance;
        }
    }
    
    render() {

        this.left += this.positionX * this.speed;
        this.top += this.positionY * this.speed;

        const gameViewRect = this.gameView.getBoundingClientRect();
        const weaponRect = this.element.getBoundingClientRect();


        // check if weapon is off screen
        if (
            weaponRect.left < gameViewRect.left ||
            weaponRect.right > gameViewRect.right || 
            weaponRect.top > gameViewRect.bottom || 
            weaponRect.top < gameViewRect.top
        ) {
            // return weapon
            this.returnWeapon();
        }

        // update weapon position
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`
    }

    returnWeapon() {
        this.element.style.display = "none";
        this.left = this.owner.left;
        this.top = this.owner.top + 25;
        this.thrown = false;
        this.positionX = 0;
        this.positionY = 0;
    }
}


// weapon without owner
// uses render() function from enemyWeapon class
class MagicalWeapon extends EnemyWeapon {
    constructor(imageSrc, gameView, top, left) {
        super(imageSrc, undefined, gameView)
        this.startTop = top;
        this.startLeft = left
        this.top = this.startTop
        this.left = this.startLeft

        // larger than regular weapon
        this.width = 64;
        this.height = 64;

        /*
        this.element = document.createElement("div");
        this.element.classList.add("weapon-element");
        this.image = document.createElement("img");

        this.image.src = imageSrc;
        this.image.classList.add("weapon-img");

        this.element.appendChild(this.image);
        this.gameView.appendChild(this.element);
        */

        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.top = `${this.top}px`;
        this.element.style.left = `${this.left}px`;
        this.element.style.display = "block";

    }

    // similar to enemyWeapon throw() except starting position is not based on owner
    throw(player) {
        if (!this.thrown) {

            //this.element.style.display = "block";
            this.thrown = true;

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

    // check if enemy weapon hit player
    weaponHit(playerElement) {
        const playerRect = playerElement.getBoundingClientRect();
        const weaponRect = this.element.getBoundingClientRect();

        if (
            playerRect.left < weaponRect.right &&
            playerRect.right > weaponRect.left &&
            playerRect.top < weaponRect.bottom &&
            playerRect.bottom > weaponRect.top
        ) {
            this.returnWeapon();
            return true;
        }
        return false;
    }

    // return to original position
    returnWeapon() {
        this.left = this.startLeft;
        this.top = this.startTop;

        this.thrown = false;

        this.positionX = 0;
        this.positionY = 0;
    }
}