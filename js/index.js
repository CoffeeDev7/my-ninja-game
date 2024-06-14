window.addEventListener("load", () => {

    const gameView = document.getElementById("game-view");

    // width, top, left
    const platform1 = new Platform(gameView, 50, 50, 50);
    const platform2 = new Platform(gameView, 150, 150, 150);
    const platform3 = new Platform(gameView, 250, 250, 250);
    const platform4 = new Platform(gameView, 350, 350, 350);
    const platform5 = new Platform(gameView, 450, 450, 450);

    /*
    let directionX = 0;

    document.addEventListener("keydown", (event) => {
        console.log(event);
        if (event.code === "KeyA") {
            console.log("Key A pressed")
            directionX = -1;
        }
        else if (event.code === "KeyD") {
            console.log("Key D pressed")
            directionX = 1;
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.code === "KeyA" || event.code === "KeyD") {
            directionX = 0;
        }
    });

    const player = document.getElementById("ninja-char");
    const playerRect = player.getBoundingClientRect();


    let left = playerRect.left;

    const intervalId = setInterval(() => {
        left += directionX * 3;
        player.style.left = `${left}px`;

    }, 1000 / 60);

    this.left += this.directionX * this.speed;
    */
});