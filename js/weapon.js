class Weapon {
    constructor(imageSrc, owner, gameView) {
        this.owner = owner;
        this.thrown = false;
        this.speed = 6;
        this.positionX = 0;
        this.positionY = 0;

        this.gameView = gameView;

        this.width = 32;
        this.height = 32;
        this.top = this.owner.top + 25;
        this.left = this.owner.left;
        
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
    }

    throw(direction) {
        if (!this.thrown) {
            // if not yet thrown, make visible, set in motion.
            console.log("throw");
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

    renderWeapon() {

        if (this.thrown) {
            
            this.left += this.positionX * this.speed;
            this.top = this.positionY;

            const gameViewRect = this.gameView.getBoundingClientRect();
            const weaponRect = this.element.getBoundingClientRect();
   

            // check if weapon is off screen
            if (weaponRect.left < gameViewRect.left || weaponRect.right > gameViewRect.right) {
                // return weapon
                this.returnWeapon();
            }
        }
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
        this.positionX = 0;
    }
}