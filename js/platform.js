class Platform {
    constructor(gameView, width, top, left) {
        this.gameView = gameView;
        this.height = 20;
        this.width = width;
        this.top = top;
        this.left = left;
        this.element = document.createElement("div");
        this.element.classList.add("platform");

        this.element.style.width = `${this.width}px`;
        this.element.style.top = `${this.top}px`;
        this.element.style.left = `${this.left}px`;

        this.gameView.appendChild(this.element);
    }

}

// add flag and method to determine when level has been passed
class EndPlatform extends Platform {
    constructor(gameView) {
        super(gameView)
        this.width = 150;
        this.top = 100;
        this.left = 720;
        this.temple = document.createElement("img");
        this.temple.src = "images/temple-gate.png";
        this.temple.classList.add("temple");
        this.element.appendChild(this.temple);

        this.element.style.width = `${this.width}px`;
        this.element.style.top = `${this.top}px`;
        this.element.style.left = `${this.left}px`;
    }

    passedLevel(playerElement) {
        const playerRect = playerElement.getBoundingClientRect();
        const templeRect = this.temple.getBoundingClientRect();

        if (
            playerRect.left < templeRect.right &&
            playerRect.right > templeRect.left &&
            playerRect.top < templeRect.bottom &&
            playerRect.bottom > templeRect.top && 
            playerRect.left < templeRect.left &&
            playerRect.bottom <= templeRect.bottom
        ) {
            return true;
        }
        
        return false;
    }
}


/*
moving platform takes 2 additional arguments:
1. does it move vertical = bool
2. ends between which the platform can move = Obj {start, end}
 */
class MovingPlatform extends Platform {
    constructor(gameView, width, top, left, vertical, ends) {
        super(gameView, width, top, left);
        this.speed = 1;
        this.vertical = vertical;
        this.ends = ends;
        this.positionX = 0;
        this.positionY = 0;
        
    }

    move() {
        if (this.vertical) {
            if (this.top < this.ends.end) {
                this.positionY = 1;  
            }
    
            if (this.top > this.ends.start) {
                this.positionY = -1;  
            }
        }
        else {
            if (this.left < this.ends.start) {
                this.positionX = 1;  
            }
    
            if (this.left > this.ends.end) {
                this.positionX = -1;  
            }
        }
        console.log("platform move");

        this.left += this.positionX * this.speed;
        this.top += this.positionY * this.speed;

        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;
    }

}