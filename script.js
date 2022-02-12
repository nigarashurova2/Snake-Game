const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 0;


let appleX = 5;
let appleY = 5;

let inputsXVelocity = 0;
let inputsYVelocity = 0;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;


class SnakePart {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}
// EAT-SOUND
const eatSound = new Audio("eat.mp3");

// game-over-sound
const gameOverSound = new Audio("finish.wav");
// const gameOverSound = new Audio("game-over-sound.wav");


// game loop
function drawGame(){
    xVelocity = inputsXVelocity;
    yVelocity = inputsYVelocity;

    changeSnakePosition();
    let result = isGameOver();
    if (result) {
        return;
    }

    clearScreen();
   
    drawSnake();
    drawApple();
    checkAppleCollision();

    drawScore();

    if (score > 5) {
        speed = 9;
    }
    if (score > 10) {
        speed = 15;
    }
    setTimeout(drawGame, 1000 / speed);
}


//---------------------------------------- CLEAR-SCREEN -----------------------------------------//
function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}



//---------------------------------------- GAME-OVER-----------------------------------------//
function isGameOver() {
    let gameOver = false;

    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    // walss
    if(headX < 0) {
        gameOver = true;
    }else if(headX === tileCount){
        gameOver = true;
    }else if(headY < 0){
        gameOver = true;
    }else if(headY === tileCount){
        gameOver = true;
    }
    

    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
        
    }

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "50px Verdana";

        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        // Fill with gradient
        ctx.fillStyle = gradient;
        ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
        
        // game-over-sound
        gameOverSound.play();
    }

    return gameOver;
}

//---------------------------------------- DRAW-SCORE-----------------------------------------//
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "18px Verdana";
    ctx.fillText("Score " + score, canvas.width-85, 20);
}

//---------------------------------------- DRAW-SNAKE -----------------------------------------//
function drawSnake() {
    ctx.fillStyle = "green";
     for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
         
     }
 
     snakeParts.push(new SnakePart(headX, headY)); //put an item at the list next to the head
     while (snakeParts.length > tailLength) {
         snakeParts.shift(); // remove the furthers item from the snake parts if have more than our tail size. 
     }
 
     ctx.fillStyle = "orange";
     ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)
 }



//---------------------------------------- SNAKE-CHANGE-POSITION -----------------------------------------//
function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}


//---------------------------------------- DRAW-APPLE -----------------------------------------//
function drawApple() {
    ctx.fillStyle = "red";
    
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}


//---------------------------------------- CHECK-APPLE-COLLISION -----------------------------------------//
function checkAppleCollision() {
    if (appleX === headX && appleY == headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        eatSound.play();
    }
}

document.body.addEventListener("keydown", keyDown);

//---------------------------------------- KeyDown -----------------------------------------//
function keyDown(event) {
    //up
  if (event.keyCode == 38 || event.keyCode == 87) {
    //87 is w
    if (inputsYVelocity == 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }

  //down
  if (event.keyCode == 40 || event.keyCode == 83) {
    // 83 is s
    if (inputsYVelocity == -1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }

  //left
  if (event.keyCode == 37 || event.keyCode == 65) {
    // 65 is a
    if (inputsXVelocity == 1) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }

  //right
  if (event.keyCode == 39 || event.keyCode == 68) {
    //68 is d
    if (inputsXVelocity == -1) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}
drawGame();

// requestAnimationFrame
// setInterval xtimes per a seccond
// setTimeOut --