//speelveld
var canvas;
var canvasContext;
//ball
var ballX = 50;
var ballY = 50;
var ballSpeedX = 5;
var ballSpeedY = 2;
//score
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;
var showingWinScreen = false;
//paddles
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_VOLUME = 10;
//sounds
var audio = new Audio("sound/punch.mp3");
var audio2 = new Audio("sound/score.mp3");
var audio3 = new Audio("sound/win.mp3");
var audio4 = new Audio("sound/lose.mp3");
var audio5 = new Audio("sound/theme.mp3");
//mousemovement
function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}
//leest je klik van je muis op winscreen
function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}
//maakt dat alles werkt meteen als je je website opstart
window.onload = function () {
  canvas = document.getElementById("gamecanvas");
  canvasContext = canvas.getContext("2d");
  var framesPerSecond = 60;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", handleMouseClick);

  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};
//reset de bal na een score
function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}
//laat player2 spelen
function computerMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 10;
  } else if (paddle2YCenter > ballY - 35) {
    paddle2Y -= 10;
  }
}
//Doet wat er gebeurt als de pal een rand raakt of een padel raakt
function moveEverything() {
  if (showingWinScreen) {
    return;
  }
  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < 20) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      audio.play();
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.34;
    } else {
      player2Score++;
      audio2.play();
      ballReset();
    }
  }
  if (ballX > canvas.width - 20) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      audio.play();
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.34;
    } else {
      player1Score++;
      audio2.play();
      ballReset();
    }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}
//net in het midden van het speelveeld
function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "#faed26");
  }
}
//laat alles op het speelvel zien.
function drawEverything() {
  //speelveld
  colorRect(0, 0, canvas.width, canvas.height, "#131313");

  if (showingWinScreen) {
    canvasContext.fillStyle = "white";

    if (player1Score >= WINNING_SCORE) {
      audio3.play();
      canvasContext.fillText("Player 1 won", 350, 200);
    } else if (player2Score >= WINNING_SCORE) {
      audio4.play();
      canvasContext.fillText(
        "You where beaten by a program that was made in one single evening :|",
        350,
        200
      );
    }
    canvasContext.fillText("CLICK TO CONTINUE", 350, 500);
    return;
  }

  drawNet();

  //player paddle 1
  colorRect(10, paddle1Y, PADDLE_VOLUME, PADDLE_HEIGHT, "#faed26");

  //player paddle 2
  colorRect(
    canvas.width - 10 - PADDLE_VOLUME,
    paddle2Y,
    PADDLE_VOLUME,
    PADDLE_HEIGHT,
    "#faed26"
  );

  //ball
  colorCircle(ballX, ballY, 10, "#86c232");

  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
}
function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  //2*pi is 360° dus een volledige cirkel, de getallen ervoor zijn de cordinaten en true or false is welk stuk je wilt vullen met pi.
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
