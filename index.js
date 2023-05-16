const gameBoard = document.querySelector('.game-board');
const scoreDiv = document.querySelector('.score');
const highScoreDiv = document.querySelector('.high-score');
const controls = document.querySelectorAll(".controls span");

let foodX, foodY;
let snakeX = 5, snakeY = 5;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let gameOver = false;
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
highScoreDiv.innerText = `High Score: ${highScore}`;


//handle game over
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over");
    location.reload();
}


//for changing the food position randomly
const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

//changing direction on click of a button
controls.forEach(button => {
    button.addEventListener("click", () => changeDirection({ key: button.dataset.key }));
})

//start the game
const startGame = () => {
    if (gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY}/${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreDiv.innerText = `Score: ${score}`;
        highScoreDiv.innerText = `High Score: ${highScore}`;
    }

    //adding body into snake
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];
    snakeX += velocityX;
    snakeY += velocityY;

    //alerting on snake hitting the wall
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;

        //if snake collided with its body
        if (i != 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    gameBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(startGame, 150);
document.addEventListener("keyup", changeDirection);