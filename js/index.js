window.addEventListener("load", () => {

    const startBtn = document.getElementById("start-btn");
    const restartBtn = document.getElementById("restart-btn");

    let game;

    function startGame() {
        game = new Game();
        console.log("start game");
        game.start();
    }

    startBtn.addEventListener("click", () => {
        startGame();
    });


    restartBtn.addEventListener("click", () => {
        startGame();
    })

    document.addEventListener("keydown", (event) => {
        console.log(event);
        if (event.code === "KeyA") {
            //console.log("Key A pressed")
            game.player.positionX = -1
        }
        else if (event.code === "KeyD") {
            //console.log("Key D pressed")
            game.player.positionX = 1;
        }
        else if (event.code === "KeyW") {
            //console.log("Key W pressed");
            game.player.jump();
        }
        else if (event.code === "KeyP") {
            game.player.weapon.throw("right");

        }
        else if (event.code === "KeyO") {
            game.player.weapon.throw("left");
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.code === "KeyA" || event.code === "KeyD") {
            game.player.positionX = 0;
        }
    });
    
    document.addEventListener("keydown", (event) => {
        const gameWidth = game.width;
        const playerLeft = game.player.left;
        //console.log("game width: ", gameWidth);
        //console.log("player left: ", playerLeft);
    });
});