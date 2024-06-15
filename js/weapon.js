class Weapon {
    constructor(imageSrc, owner, gameView) {
        this.owner = owner;
        this.thrown = false;
        this.speed = 6;
        this.positionX = 0;

        this.gameView = gameView;

        this.width = 32;
        this.height = 32;
        this.top = 0;
        this.left = 0;

        this.currentTop = 0;
        
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
        this.owner.element.appendChild(this.element);
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
            // need to find the current y position of weapon
            // maybe difference between weaponrect.top and gameviewrect.top (?)

            // maybe weapon should be relative to game view (?)

            //this.currentTop = parseFloat(this.owner.element.style.top)
            console.log("current weapon top: ", this.currentTop)

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
            const gameViewRect = this.gameView.getBoundingClientRect();
            const weaponRect = this.element.getBoundingClientRect();
   

            // check if weapon is off screen
            if (weaponRect.left < gameViewRect.left || weaponRect.right > gameViewRect.right) {
                // return weapon
                this.returnWeapon();
            }
        }
        
        // update weapon position
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.currentTop}px`
        
    }

    // return weapon back to player
    returnWeapon() {
        this.element.style.display = "none";
        this.left = 0;
        this.top = 0;
        this.thrown = false;
        this.positionX = 0;
    }
}