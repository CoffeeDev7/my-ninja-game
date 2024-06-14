class Platform {
    constructor(gameScreen, width, top, left) {
        this.gameScreen = gameScreen;
        this.height = 20;
        this.width = width;
        this.top = top;
        this.left = left;
        this.element = document.createElement("div");
        this.element.classList.add("platform");

        this.element.style.width = `${this.width}px`;
        this.element.style.top = `${this.top}px`;
        this.element.style.left = `${this.left}px`;

        this.gameScreen.appendChild(this.element);
    }

}

class MovingPlatform extends Platform {

}