class Player {
    constructor(gameView) {
        this.gameView = gameView;
        this.width = 35;
        this.height = 64;
        this.top = 400;
        this.left = 100;
        this.element = document.createElement("div");
        this.image = document.createElement("img");

        this.speed = 4;
        this.positionX = 0;
        //this.positionY = 0;
        //this.jumpHeight = ?;

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
        //console.log("function call");
        this.left += this.positionX * this.speed;
        //this.top += this.positionY * this.jumpHeight;

        
        if (this.left < 3) {
            this.left = 3;
        }

        if (this.left > this.gameView.clientWidth - this.width) {
            this.left = this.gameView.clientWidth - this.width;
        }

        this.element.style.top = `${this.top}px`;
        this.element.style.left = `${this.left}px`;
    }
}

/*
position: absolute;
width: 35px;
height: 64px;
border: 2px solid red;
top: 400px; 
left: 100px; */