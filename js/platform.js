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

class MovingPlatform extends Platform {

}