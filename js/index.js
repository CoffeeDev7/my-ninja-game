window.addEventListener("load", () => {

    const startBtn = document.getElementById("start-btn");
    const restartBtn = document.getElementById("restart-btn");
    const continueBtn = document.getElementById("continue-btn");

    let game;

    function startGame() {
        game = new Game();
        console.log("start game");
        game.levelThree();
    }

    startBtn.addEventListener("click", () => {
        startGame();
    });


    restartBtn.addEventListener("click", () => {
        startGame();
    });


    continueBtn.addEventListener("click", () => {
        if (game) {
            game.nextLevel(game.level);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.code === "KeyA") {
            //console.log("Key A pressed")
            if (game) {
                game.player.positionX = -1
            }
        }
        else if (event.code === "KeyD") {
            //console.log("Key D pressed")
            if (game) {
                game.player.positionX = 1;
            }
        }
        else if (event.code === "KeyW") {
            //console.log("Key W pressed");
            if (game) {
                game.player.jump();
            }
        }
        else if (event.code === "KeyP") {
            if (game) {
                if (game.endLevel) {
                    game.player.weapon.throwUp();
                }
                else {
                    game.player.weapon.throw("right");
                }
            }
        }
        else if (event.code === "KeyO") {
            if (game) {
                if (game.endLevel) {
                    game.player.weapon.throwUp()
                }
                else {
                    game.player.weapon.throw("left");
                }
            }
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.code === "KeyA" || event.code === "KeyD") {
            if (game) {
                game.player.positionX = 0;
            }
        }
    });
    
    
});