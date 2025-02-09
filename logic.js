// board will contain the current state of the board
let board;
let score = 0;

let rows = 4;
let columns = 4;
let is2024Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// we are going to contain array of arrays in board, nested array, 2d array, matrix

// function that will set the gameboard:
function setGame() {
    // this will create a 4x4 board
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // create the game board on the html document
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r + "-" + c;
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    setOne();
    setOne();
}  
// function that will update the tile with the number
function updateTile(tile, num) {

    // clear the tile:
    tile.innerText = "";

    // clear the classlist to avoid multiple classses
    tile.classList.value = "";

    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;

        if (num <= 4096) {
            tile.classList.add("x" + num);
        } else {
            tile.classList.add("x8192");
        }

    }
}


window.onload = function() {
    setGame();
}


function handleSlide(event) {
    console.log(event.code);
    // event.preventDefault();
    if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) {
        if (event.code == "ArrowLeft" && canMoveLeft()) {
            slideLeft();
            setOne();
        } else if (event.code == "ArrowRight" && canMoveRight()) {
            slideRight();
            setOne();

        } else if (event.code == "ArrowUp" && canMoveUp()) {
            slideUp();
            setOne();

        } else if (event.code == "ArrowDown" && canMoveDown()) {
            slideDown();
            setOne();
        }

    }
    document.getElementById('score').innerText = score;

    setTimeout(()=>{
        if(hasLost()){
            alert("Game Over! You have lost the game. Game will restart.");
            restartGame();
            alert("Click any arrow key to restart");
            
        }
        else{
            checkWin();

        }
    },100)
}

function restartGame(){
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    setOne(); // New tile


}

// EventListener
document.addEventListener("keyup", handleSlide);

function slideLeft() {
    for(let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = row.slice();



        row = slide(row);
        board[r] = row;
        for(let c = 0; c < columns; c++) {
            let tile = document.getElementById(r + "-" + c);
            let num = board[r][c];
            if(originalRow[c] !== num && num !== 0) {
                // Animation
                tile.style.animation = "slide-from-right 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }


            updateTile(tile, num);
        }
    }

}

function slideRight() {
    for(let r = 0; r < rows; r++) {
        let row = board[r];
        
        let originalRow = row.slice();

        row.reverse();
        row = slide(row);
        board[r] = row.reverse();
        for(let c = 0; c < columns; c++) {
            let tile = document.getElementById(r + "-" + c);
            let num = board[r][c];
            if(originalRow[c] !== num && num !== 0) {
                // Animation
                tile.style.animation = "slide-from-left 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num);


        }
    }
}

function slideUp() {
    for(let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalRow = row.slice();
        row = slide(row);
        for(let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r + "-" + c);
            let num = board[r][c];
            if(originalRow[r] !== num && num !== 0) {
                // Animation
                tile.style.animation = "slide-from-bottom 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile, num);
        }
    }
}

// function slideUp() {
//   for (let c = 1; c < columns; c++) {
//     let col = board.map((row) => row[c]);
//     col = slide(col);
//     for (let r = 0; r < rows; r++) {
//       board[r][c] = col[r];
//       let tile = document.getElementById(r + "-" + c);
//       let num = board[r][c];
//       updateTile(tile, num);
//     }
//   }
// }

function slideDown(){
    for(let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalRow = row.slice();
        row.reverse();
        row = slide(row);
        row.reverse();
        for(let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r + "-" + c);
            let num = board[r][c];
            if(originalRow[r] !== num && num !== 0) {
                // Animation
                tile.style.animation = "slide-from-top 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile, num);
        }
    }

} 

function filterZero(row){
    // this filter will remove zero element form our array
    return row.filter(num => num != 0);
}
function slide(row) {
    row = filterZero(row);

    for(let i = 0; i < row.length - 1; i++) {
        if(row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }

    row = filterZero(row);
    while(row.length < columns) {
        row.push(0);
    }

    return row;
}

// create a function that will check if there is an enpty file in the board
function hasEmptyTile() {
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            if(board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function setOne(){
    // early exit if there is no available slot for the tile:
    if(!hasEmptyTile()) {
        return;
    }

    // found a variable will if wa are able to find a slot or position or coordinate for the tile that will be added
    let found = false;
    while(!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if(board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r + "-" + c);
            updateTile(tile,board[r][c]);

            found = true;
        }
        // console.log(board);
    }

}

// function that will check if there is a possible to move left
function canMoveLeft() {
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            if(board[r][c] != 0) {
                if(c > 0) {
                    if(board[r][c - 1] == 0 || board[r][c - 1] == board[r][c]) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function canMoveRight() {
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            if(board[r][c] != 0) {
                if(c < columns - 1) {
                    if(board[r][c + 1] == 0 || board[r][c + 1] == board[r][c]) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function canMoveUp() {
    for(let c = 0; c < columns; c++) {
        for(let r = 0; r < rows; r++) {
            if(board[r][c] != 0) {
                if(r > 0) {
                    if(board[r - 1][c] == 0 || board[r - 1][c] == board[r][c]) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function canMoveDown() {
    for(let c = 0; c < columns; c++) {
        for(let r = 0; r < rows; r++) {
            if(board[r][c] != 0) {
                if(r < rows - 1) {
                    if(board[r + 1][c] == 0 || board[r + 1][c] == board[r][c]) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function checkWin(){
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            if(board[r][c] == 2048 && is2024Exist == false ) {
                alert("You win! You got the 2048 tile!");
                is2024Exist = true;
            }
            else if(board[r][c] == 4096 && is4096Exist == false) {
                alert("You win! You got the 4096 tile!");
                is4096Exist = true;
            }
            else if(board[r][c] == 8192 && is8192Exist == false) {
                alert("You win! You got the 8192 tile!");
                is8192Exist = true;
            }
        }
    }
    return false;

}

function hasLost() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return false;
            }
            let currentTile = board[r][c];

            if(r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile){
                    return false;
                }

        }
    }
    return true;
}