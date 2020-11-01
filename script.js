/*
Game State
*/

const gameBoard = (() => {
    const amountOfCells = 3;
    let cells = Array.from(Array(amountOfCells), () => new Array(amountOfCells));

    let winningSym = "";

    const placePlayer = (play, posX, posY) => {
        cells[posX][posY] = play;
        checkWin();   
    };

    const horizontalWin = ((startIdx) => {
        let sym = cells[startIdx][0];
        if(sym === undefined) {
            return false;
        }

        if(sym === cells[startIdx][1] && sym === cells[startIdx][2]) {
            winningSym = sym;
            return true;
        } else {
            return false;
        }
    });

    const verticalWin = ((startIdx) => {
        let sym = cells[0][startIdx];
        if(sym === undefined) {
            return false;
        }

        if(sym === cells[1][startIdx] && sym === cells[2][startIdx]) {
            winningSym = sym;
            return true;
        } else {
            return false;
        }
    });

    const diagonalWinLeft = () => {
        let sym = cells[0][0]
        if(sym === undefined) {
            return false;
        }
        if(sym === cells[1][1] && sym === cells[2][2]) {
            winningSym = sym;
            return true;
        } else {
            return false;
        }
    }

    const diagonalWinRight = () => {
        sym = cells[0][2];
        if(sym === undefined) {
            return false;
        }

        if(sym === cells[1][1] && sym === cells[2][0]) {
            winningSym = sym;
            return true;
        } else {
            return false;
        }
    }

    const winCondition = () => {
         let horizontalWins = horizontalWin(0) || 
                            horizontalWin(1) ||
                            horizontalWin(2);
        
        let verticalWins = verticalWin(0) || 
                            verticalWin(1) || 
                            verticalWin(2);

        let diagonalWins = diagonalWinLeft() || diagonalWinRight();
        
        return horizontalWins || verticalWins || diagonalWins;
    };

    const checkTie = () => {
        let cellList = document.getElementsByClassName("cell");
        for(let cell of cellList) {
            if(cell.textContent === "") {
                return false;
            }
        }

        return true;
    };

    const checkWin = () => {
        //Work with timeout, since otherwise winner is declared 
        //before the button has been pressed / Symbol been shown
        setTimeout(function () {
            if(winCondition()) {
                displayController.displayWinner(winningSym);
                displayController.disableAllCellButtons();
            } else if(checkTie()) {
                displayController.displayTie();
                displayController.disableAllCellButtons();
            }
        }, 50);
    }

    const clearArray = () => {
        winningSym = "";
        cells = Array.from(Array(amountOfCells), 
                    () => new Array(amountOfCells));
    };

    const getCells = () => cells;

    return {placePlayer, getCells, clearArray};
})();


class GameState {
    constructor(player, enemy) {
        this.player = player;
        this.enemy = enemy;
        this.currentActor = player;
        this.pvpState = false;
    }

    getCurrentActor() {
        return this.currentActor;
    }

    setCurrentActor(actor) {
        this.currentActor = actor;
    }
}

/*
Actor, playable Players
*/

function Actor (symbol, name) {
    let obj = Object.create(Actor.proto);
    obj.name = name;
    obj.symbol = symbol;

    return obj;
};

Actor.proto = {
    getName: function () {
        return this.name;
    },

    getSymbol: function () {
        return this.symbol;
    },
}


/*
Display
*/

const displayController = (() => {
    let map = new Map();
    let gameState;
    let pvpState;

    let startUpWrapperDiv = document.getElementById("startUpWrapper");
    let mainGameWindowDiv = document.getElementById("mainGameWindow");
    let matchupInfo = document.getElementById("matchupInfo");
    let startupInfo = document.getElementById("startUpInfo");

    let playerNameInfo = document.getElementById("playerNameInfo");
    let enemyNameInfo = document.getElementById("enemyNameInfo");
    let playerSymbolInfo = document.getElementById("playerSymbolInfo");
    let enemySymbolInfo = document.getElementById("enemySymbolInfo");

    const init = () => {
        initButtons();
    }

    const initButtons = () => {
        //Startup Buttons
        initStartUpButtons();

        //Game Buttons
        initCellButtons();
        setNewGameButton();
        setResetButton();
    };

    const initStartUpButtons = () => {
        initChooseEnemyButtons();
        initChooseSymbolButtons();
    }

    const initChooseEnemyButtons = () => {
        let chooseEnemyBtns = document.getElementById("chooseEnemy");
        let chooseSymbolBtns = document.getElementById("chooseSymbol");

        let vsPlayerBtn = document.getElementById("vsPlayerBtn");
        vsPlayerBtn.addEventListener("click", () => {

            pvpState = true;

            //HTML stuff
            playerNameInfo.textContent = "Player 1";
            enemyNameInfo.textContent= "Player 2";
            matchupInfo.textContent = "Player 1 vs. Player 2";

            openElement(matchupInfo);
            hideElement(chooseEnemyBtns);
            openElement(chooseSymbolBtns);
        });
        //TODO:
        //Stuff to allow two players to play with switching etc
        let vsAIBtn = document.getElementById("vsAIBtn");
        vsAIBtn.addEventListener("click", () => {

            pvpState = false;

            //HTML stuff
            playerNameInfo.textContent = "Player";
            enemyNameInfo.textContent = "AI";
            matchupInfo.textContent = "Player vs. AI";

            openElement(matchupInfo);
            hideElement(chooseEnemyBtns);
            openElement(chooseSymbolBtns);
        });


    }

    const initChooseSymbolButtons = () => {
        //ChooseX Button
        let chooseX = document.getElementById("chooseX");
        chooseX.addEventListener("click", () => {
            hideElement(startUpWrapperDiv);
            hideElement(matchupInfo);
            hideElement(startupInfo)
            openElement(mainGameWindowDiv);

            //Init Player Object with choosen Symbol
            let player = Actor("X", playerNameInfo.textContent);
            let enemy = Actor("O", enemyNameInfo.textContent);
            gameState = new GameState(player, enemy);

            playerSymbolInfo.textContent = "X";
            enemySymbolInfo.textContent= "O";


            map.set("X", playerNameInfo.textContent);
            map.set("O", enemyNameInfo.textContent);
        });

        //ChooseO Button
        let chooseO = document.getElementById("chooseO");
        chooseO.addEventListener("click", () => {
            hideElement(startUpWrapperDiv);
            hideElement(matchupInfo);
            hideElement(startupInfo)
            openElement(mainGameWindowDiv);

            //Init Player Object with choosen Symbol
            let player = Actor("O", playerNameInfo.textContent);
            let enemy = Actor("X", enemyNameInfo.textContent);
            gameState = new GameState(player, enemy);

            playerSymbolInfo.textContent = "O";
            enemySymbolInfo.textContent = "X";


            map.set("O", playerNameInfo.textContent);
            map.set("X", enemyNameInfo.textContent);
        });
    }

    

    const initCellButtons = () => {
        let cellBtns = document.getElementsByClassName("cell");
        Array.from(cellBtns).forEach(btn => {
            btn.addEventListener("click", () => {
                //Get Cell Position in Array
                let posX = Math.floor(btn.dataset.indexNumber / 10);
                let posY = btn.dataset.indexNumber % 10;

                //get Player Symbol and place it in internal array
                let playedSymbol = gameState.getCurrentActor().getSymbol();
                btn.textContent = playedSymbol;
                gameBoard.placePlayer(playedSymbol, posX, posY); 

                //Move to Next Player
                if(gameState.getCurrentActor() === gameState.player) {
                    gameState.setCurrentActor(gameState.enemy);
                } else {
                    gameState.setCurrentActor(gameState.player); 
                }

                console.log("Added "+playedSymbol+" at: ("+posX+","+posY+")");

                disableCellButton(btn);
            });
        });
    };

    

    const setNewGameButton= () => {
        let newGameBtn = document.getElementById("newGameBtn");

        let chooseSymbol = document.getElementById("chooseSymbol");
        let chooseEnemy = document.getElementById("chooseEnemy");

        //Brings up the startmenu to select new symbol and change to Player/AI
        newGameBtn.addEventListener("click", () => {
            clearGameState();

            hideElement(mainGameWindowDiv);
            hideElement(matchupInfo);
            hideElement(chooseSymbol);
            
            openElement(startUpWrapperDiv);
            openElement(startupInfo);
            openElement(chooseEnemy);
        });
    };

    const setResetButton = () => {
        let resetBtn = document.getElementById("resetGameBtn");
        resetBtn.addEventListener("click", () => {
            clearGameState();
        });
        
    };

    const clearGameState = () => {
        //Clear gameBoard
        gameBoard.clearArray();

        //Reset gameState
        gameState.setCurrentActor(gameState.player);

        //Clear Display
        clearDisplay();
        
        //Enable All Buttons
        enableAllCellButtons();

        //Clear WinText
        let winText = document.getElementById("winText");
        hideElement(winText);
    }

    const clearDisplay = () => {
        let cellList = document.getElementsByClassName("cell");
        Array.from(cellList).forEach(cell => {
            cell.textContent = "";
        });
    }

    const enableCellButton = btn => {
        btn.disabled = false;
        btn.className = "cell";
    };

    const enableAllCellButtons = () => {
        let board = document.getElementById("gameBoard");
        let cellList = board.getElementsByTagName("button");
        Array.from(cellList).forEach(cell => {
            enableCellButton(cell);
        });
    }

    const disableCellButton = btn => {
        btn.disabled = true;
        btn.className += " removeHover";
    };

    const disableAllCellButtons = () => {
        let cellList = document.getElementsByClassName("cell");
        Array.from(cellList).forEach(cell => {
            disableCellButton(cell);
        });
    };

    const hideElement = (element) => {
        element.style.display = "none";
    };

    const openElement = (element) => { 
        element.style.display = "block";
    };

    const displayWinner = (winSym) => {
        let winText = document.getElementById("winText");
        winText.textContent = map.get(winSym)+" won!";
        openElement(winText);
    };

    const displayTie = () => {
        let winText = document.getElementById("winText");
        winText.textContent = "Tie!";
        openElement(winText);
    }

    init();
    return {displayWinner, displayTie, disableAllCellButtons};
})();