const colors = ["green", "red", "yellow", "blue"];
var sequence = [];
var clickPattern = [];
var level = 0;
var highScore = 0;
var interact = "click"
const audio = {
    "red": new Audio("sounds/red.mp3"),
    "green": new Audio("sounds/green.mp3"),
    "blue": new Audio("sounds/blue.mp3"),
    "yellow": new Audio("sounds/yellow.mp3"),
    "wrong": new Audio("sounds/wrong.mp3")
}

function checkTouchInput() {
    if (window.matchMedia("(pointer: coarse)").matches) interact = "touchend";

}


function playSound(color) {
    audio[color].play();
}

function animateNextSequence(color) {
    $(`#${color}`).slideUp(100).slideDown(100);
}

function animatePress(color) {
    $('#' + color).addClass('pressed');
    setTimeout(() => $('#' + color).removeClass('pressed'), 100);
}

function animateSuccesLevel() {
    $(".container").addClass("success")
    setTimeout(() => $(".container").removeClass("success"), 900)
}

function startGame(event) {
    if (level === 0) {
        $(document).off("click");
        setTimeout(nextSequence, 500);
    }
}

function resetGame() {
    checkIfHighScore(level);
    level = 0;
    clickPattern = [];
    sequence = [];
    $("body").addClass("game-over");
    $(".btn").off(interact);
    setTimeout(() => {
        $("body").removeClass("game-over");
        $(document).on("click", startGame)
        $("#level-title").text("Click Anywhere to Restart")
    }, 1000)
}

function nextSequence() {
    $(".btn").on(interact, clickHandler);
    $("#level-title").text(`Level ${level}`)
    let randomNumber = Math.floor(Math.random() * 4);
    let randomColor = colors[randomNumber];
    sequence.push(randomColor);
    animateNextSequence(randomColor);
    playSound(randomColor);
    level++;

}

function checkAnswer(userClickedColor) {
    console.log(sequence[clickPattern.length])
    console.log(userClickedColor)
    return (sequence[clickPattern.length] === userClickedColor)
}

function saveHighScoreLocal(highScore) {
    localStorage.setItem("highScore", highScore)
}

function checkIfHighScore(level) {
    if (level > highScore) {
        highScore = level;
        $(".high-score").text("High-Score - " + highScore);
        saveHighScoreLocal(highScore);
    }
}

function getHighScoreLocal() {
    let localHighScore = localStorage.getItem("highScore");
    if (localHighScore) highScore = localHighScore;
    $(".high-score").text("High-Score - " + highScore);
}

function clickHandler(event) {
    let userClickedColor = $(this).attr("id");
    if (sequence.length > clickPattern.length) {
        if (checkAnswer(userClickedColor)) {
            animatePress(userClickedColor);
            playSound(userClickedColor);
            clickPattern.push(userClickedColor);
            if (sequence.length === clickPattern.length) {
                animateSuccesLevel();
                clickPattern = [];
                $(".btn").off(interact);
                setTimeout(nextSequence, 1000);
            }
        } else {
            $(".btn").off(interact)
            $("#level-title").text("Game Over!")
            playSound("wrong");
            resetGame();

        }
    }
}





$(document).ready(() => {
    getHighScoreLocal();
    checkTouchInput();
    $(document).on("click", startGame)
})
