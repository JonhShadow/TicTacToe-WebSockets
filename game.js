const game = document.querySelector(".game");
const restartButton = document.querySelector(".restart");
const finishsection = document.querySelector(".finish");
const winsection = document.querySelector(".win");
const drawsection = document.querySelector(".draw");
const svg = document.querySelector(".line");

const Xturn = document.querySelector(".Xtime");
const Oturn = document.querySelector(".Otime");

const Xwinner = document.querySelector(".Xtime .counter");
const Owinner = document.querySelector(".Otime .counter");

const cross = '<i class="fas fa-times cross">';
const circle = '<i class="far fa-circle circle">';

let p1 = true;
let p2 = false;

game.addEventListener("click", play);
restartButton.addEventListener("click", restartGame);
document.addEventListener("DOMContentLoaded", loadSession);

function play(e) {
  e.stopPropagation();
  const click = e.target;
  //console.log(click.children[0]);

  if (p1 == true && p2 == false) {
    if (click.children.length == 0) {
      click.innerHTML = cross;

      p1 = false;
      Xturn.style.borderColor = "#f2ebd3";
      p2 = true;
      Oturn.style.borderColor = "rgb(82, 85, 83)";

      setTimeout(checkWin, 100);
    }
  } else {
    if (click.children.length == 0) {
      e.target.innerHTML = circle;

      p1 = true;
      Xturn.style.borderColor = "rgb(82, 85, 83)";
      p2 = false;
      Oturn.style.borderColor = "#f2ebd3";

      setTimeout(checkWin, 100);
    }
  }
}

function checkWin() {
  for (let i = 0; i < 3; i++) {
    let c1 = game.children[0].children[i].children[0];
    let c2 = game.children[1].children[i].children[0];
    let c3 = game.children[2].children[i].children[0];
    if (c1 != undefined && c2 != undefined && c3 != undefined) {
      if (c1.isEqualNode(c2) && c1.isEqualNode(c3) && c2.isEqualNode(c3)) {
        switch (i) {
          case 0:
            game.removeEventListener("click", play);
            drawLine(c1.classList, "M100 10L100 580");
            setTimeout(() => {
              isWin(c1.classList);
            }, 2000);
            break;
          case 1:
            game.removeEventListener("click", play);
            drawLine(c1.classList, "M300 10L300 580");
            setTimeout(() => {
              isWin(c1.classList);
            }, 2000);
            break;
          case 2:
            game.removeEventListener("click", play);
            drawLine(c1.classList, "M500 10L500 580");
            setTimeout(() => {
              isWin(c1.classList);
            }, 2000);
            break;
        }
        return;
      }
    }

    let r1 = game.children[i].children[0].children[0];
    let r2 = game.children[i].children[1].children[0];
    let r3 = game.children[i].children[2].children[0];
    if (r1 != undefined && r2 != undefined && r3 != undefined) {
      if (r1.isEqualNode(r2) && r1.isEqualNode(r3) && r2.isEqualNode(r3)) {
        switch (i) {
          case 0:
            game.removeEventListener("click", play);
            drawLine(r1.classList, "M20 90L570 90");
            setTimeout(() => {
              isWin(r1.classList);
            }, 2000);
            break;
          case 1:
            game.removeEventListener("click", play);
            drawLine(r1.classList, "M20 290L570 290");
            setTimeout(() => {
              isWin(r1.classList);
            }, 2000);
            break;
          case 2:
            game.removeEventListener("click", play);
            drawLine(r1.classList, "M20 500L570 500");
            setTimeout(() => {
              isWin(r1.classList);
            }, 2000);
            break;
        }
        return;
      }
    }
  }

  let d1 = game.children[0].children[0].children[0];
  let d2 = game.children[1].children[1].children[0];
  let d3 = game.children[2].children[2].children[0];
  if (d1 != undefined && d2 != undefined && d3 != undefined) {
    if (d1.isEqualNode(d2) && d1.isEqualNode(d3) && d2.isEqualNode(d3)) {
      game.removeEventListener("click", play);
      drawLine(d1.classList, "M25,10L580,575");
      setTimeout(() => {
        isWin(d1.classList);
      }, 2000);
      return;
    }
  }

  d1 = game.children[0].children[2].children[0];
  d2 = game.children[1].children[1].children[0];
  d3 = game.children[2].children[0].children[0];
  if (d1 != undefined && d2 != undefined && d3 != undefined) {
    if (d1.isEqualNode(d2) && d1.isEqualNode(d3) && d2.isEqualNode(d3)) {
      game.removeEventListener("click", play);
      drawLine(d1.classList, "M20,575L575,10");
      setTimeout(() => {
        isWin(d1.classList);
      }, 2000);
      return;
    }
  }
  boardIsFull();
}

function isWin(winner) {
  svg.classList.add("visibility");
  const winList = document.querySelector(".winList");
  if (winner.contains("cross")) {
    winList.innerHTML = '<i class="fas fa-times cross">';
    if (Xwinner.innerText == "-") Xwinner.innerText = "1";
    else Xwinner.innerText = parseInt(Xwinner.innerText) + 1;
  } else {
    winList.innerHTML = '<i class="far fa-circle circle">';
    if (Owinner.innerText == "-") Owinner.innerText = "1";
    else Owinner.innerText = parseInt(Owinner.innerText) + 1;
  }

  saveLocalStorage();

  game.classList.add("visibility");
  cleanBoard();
  finishsection.classList.remove("visibility");
  winsection.classList.remove("visibility");
}

function restartGame(e) {
  finishsection.classList.add("visibility");
  drawsection.classList.add("visibility");
  winsection.classList.add("visibility");

  p1 = true;
  Xturn.style.borderColor = "rgb(82, 85, 83)";
  p2 = false;
  Oturn.style.borderColor = "#f2ebd3";

  game.classList.remove("visibility");
  game.addEventListener("click", play);
}

function boardIsFull() {
  let completed = 0;
  for (let i = 0; i < 3; i++) {
    let c1 = game.children[0].children[i].children[0];
    let c2 = game.children[1].children[i].children[0];
    let c3 = game.children[2].children[i].children[0];

    if (c1 != undefined && c2 != undefined && c3 != undefined) {
      completed += 1;
    }
  }
  if (completed == 3) {
    console.log("Draw!");
    isDraw();
    cleanBoard();
    return;
  }
}

function isDraw() {
  game.classList.add("visibility");
  finishsection.classList.remove("visibility");
  drawsection.classList.remove("visibility");
}

function cleanBoard() {
  for (let i = 0; i < 3; i++) {
    let c1 = game.children[0].children[i];
    let c2 = game.children[1].children[i];
    let c3 = game.children[2].children[i];

    c1.innerHTML = "";
    c2.innerHTML = "";
    c3.innerHTML = "";
  }
}

function drawLine(winner, line) {
  if (winner.contains("cross")) {
    svg.children[0].style.stroke = "#545454";
  } else {
    svg.children[0].style.stroke = "#f2ebd3";
  }
  //const d = "M50,25L575,575";
  // 1 row = "M30 90L560 90"
  // D = "M20,575L575,10";
  // a = "M50,25L575,575";
  svg.children[0].attributes[1].nodeValue = line;
  svg.classList.remove("visibility");
}

function loadSession() {
  let points;
  if (sessionStorage.getItem("points") === null) {
    points = { X: "-", O: "-" };
  } else {
    points = JSON.parse(sessionStorage.getItem("points"));
  }
  Xwinner.innerText = points["X"];
  Owinner.innerText = points["O"];
}

function saveLocalStorage() {
  let points;
  if (sessionStorage.getItem("todos") === null) {
    points = { X: "-", O: "-" };
  } else {
    points = JSON.parse(sessionStorage.getItem("points"));
  }
  points["X"] = Xwinner.innerText;
  points["O"] = Owinner.innerText;
  sessionStorage.setItem("points", JSON.stringify(points));
}
