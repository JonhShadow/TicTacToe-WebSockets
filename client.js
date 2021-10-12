const playersDiv = document.querySelector(".player");
const roomCreation = document.querySelector(".roomCreation");

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
  const loading = document.querySelector(".roomCreationBtn button img");

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
  const ws = new WebSocket("ws://localhost:8082"); // wss for production
  ws.onopen = function () {
    ws.addEventListener("message", ({ data }) => {
      data = JSON.parse(data);
      console.log(data);
      if (data["status"] != 100) {
        newLog = "<p>" + data["data"] + "</p>";
        log.innerHTML += newLog;
      }
      if (data["data"] == "Wait for game to start!") {
        roomCreation.classList.add("visibility");
        game.classList.remove("visibility");
        playersDiv.classList.remove("visibility");
        game.addEventListener("click", play);
      }
      if (data["status"] == "opponetDetails") {
        console.log(data["data"]);
        playerInfo(data["data"], user["name"]);
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
  } else {
    const O = document.querySelector(".Otime .user");
    O.innerText = name;

    const X = document.querySelector(".Xtime .user");
    X.innerText = username;
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
