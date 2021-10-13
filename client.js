const playersDiv = document.querySelectorAll(".player");
const playerLog = document.querySelector(".player .log");
const roomCreation = document.querySelector(".roomCreation");
const loading = document.querySelector(".roomCreationBtn button img");

const createRoomBtn = document.querySelector(
  ".roomCreation .roomCreationBtn button"
);

const createRoomUserName = document.querySelector(
  ".roomCreation .userNameInput input"
);
const createRoomName = document.querySelector(
  ".roomCreation .roomNameInput input"
);

const log = document.querySelector(".log");

createRoomBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const validityStateUserName = createRoomUserName.validity;
  const validityStateName = createRoomName.validity;

  if (validityStateUserName.valueMissing) {
    createRoomUserName.setCustomValidity("Choose a user name");
    createRoomUserName.reportValidity();
    return;
  } else {
    createRoomUserName.setCustomValidity("");
    createRoomUserName.reportValidity();
  }

  if (validityStateName.valueMissing) {
    createRoomName.setCustomValidity(
      "Choose a room name to create or to connect"
    );
    createRoomName.reportValidity();
    return;
  } else {
    createRoomName.setCustomValidity("");
    createRoomName.reportValidity();
  }
  createRoomBtn.disabled = true;
  createRoomBtn.style.cursor = "wait";
  loading.style.opacity = 1;
  socketConnect({ name: createRoomUserName.value, room: createRoomName.value });
});

function socketConnect(user) {
  let mySelf;
  const ws = new WebSocket("ws://localhost:8082"); // wss for production
  ws.onopen = function () {
    ws.addEventListener("message", ({ data }) => {
      data = JSON.parse(data);
      console.log(data);
      if (data["status"] != 100) {
        newLog = "<p>" + data["data"] + "</p>";
        log.innerHTML += newLog;
        if (data["status"] == 400) {
          createRoomName.value = "";
          createRoomBtn.disabled = false;
          createRoomBtn.style.cursor = "pointer";
          loading.style.opacity = 0;
        }
      }
      if (data["data"] == "Wait for game to start!") {
        roomCreation.classList.add("visibility");
        game.classList.remove("visibility");
        playersDiv.forEach(function each(div) {
          div.classList.remove("visibility");
        });
        cleanBoard();
        game.addEventListener("click", function (e) {
          play(e, ws, mySelf["piece"]);
        });
        restartButton.addEventListener("click", function (e) {
          restartGame(e, ws);
        });
        if (mySelf["piece"] == "x") {
          game.style.pointerEvents = "initial";
          playerLog.innerText = "My turn!";
          console.log("My turn");
          Xturn.style.borderColor = "rgb(82, 85, 83)";
          Oturn.style.borderColor = "#f2ebd3";
        } else {
          game.style.pointerEvents = "none";
          console.log("Opponent turn");
          playerLog.innerText = "Opponent turn!";
          Xturn.style.borderColor = "rgb(82, 85, 83)";
          Oturn.style.borderColor = "#f2ebd3";
        }
      }
      if (data["status"] == "opponetDetails") {
        console.log(data["data"]);
        mySelf = playerInfo(data["data"], user["name"]); // return info about myself
      }
      if (data["status"] == "move") {
        moveTo = "." + data["place"][0] + " ." + data["place"][1] + "";
        document.querySelector(moveTo).innerHTML = data["piece"];
        setTimeout(checkWin, 100);

        game.style.pointerEvents = "initial";
        console.log("My turn");
        playerLog.innerText = "My turn!";

        if (mySelf["piece"] == "x") {
          Xturn.style.borderColor = "rgb(82, 85, 83)";
          Oturn.style.borderColor = "#f2ebd3";
        } else {
          Xturn.style.borderColor = "#f2ebd3";
          Oturn.style.borderColor = "rgb(82, 85, 83)";
        }
      }
      if (data["status"] == "restart") {
        console.log(data);
        game.style.pointerEvents = turnState;
        if (game.style.pointerEvents == "initial") {
          playerLog.innerText = "My turn!";
        } else {
          playerLog.innerText = "Opponent turn!";
        }
      }
      if (data["status"] == "disconecting") {
        playerLog.innerText = data["data"];
        game.style.pointerEvents = "none";
      }
    });
    ws.send(JSON.stringify(user));
  };
}

function playerInfo({ name, piece }, username) {
  if (piece == "x") {
    const X = document.querySelector(".Xtime .user");
    X.innerText = name;

    const O = document.querySelector(".Otime .user");
    O.innerText = username;
    return { name: username, piece: "o" };
  } else {
    const O = document.querySelector(".Otime .user");
    O.innerText = name;

    const X = document.querySelector(".Xtime .user");
    X.innerText = username;
    return { name: username, piece: "x" };
  }
}
/*
ws.addEventListener("open", () => {
  console.log("Client connected");
  ws.send("Hi, server");
});

ws.addEventListener("message", ({ data }) => {
  console.log(data);
});

ws.addEventListener("close", () => {
  console.log("Server is down");
  ws.close();
});
*/
