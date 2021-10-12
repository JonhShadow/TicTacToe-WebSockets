const Room = require("./Room.js");

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8082 });

let rooms = {};

wss.getUniqueID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
};

wss.getAllIds = function () {
  wss.clients.forEach(function each(client) {
    console.log("Client.ID: " + client.id);
  });
};

wss.on("connection", (ws, rep) => {
  ws.on("message", (data) => {
    user = JSON.parse(data);
    ws.id = wss.getUniqueID();
    ws.name = user.name;
    ws.room = user.room;

    console.log("New Client:" + ws.name);
    if (!rooms[ws.room]) {
      let newRoom = new Room(ws);
      rooms[ws.room] = newRoom;
      console.log(
        "New room[" +
          rooms[ws.room].getRoomName() +
          "]: " +
          newRoom.getGameStatus()
      );
      rooms[ws.room].players.forEach(function each(client) {
        client.send(
          JSON.stringify({
            status: 200,
            data: rooms[client.room].getGameStatus(),
          })
        );
      });
    } else {
      let feedback = rooms[ws.room].addP2(ws);
      if (feedback["status"] == 200) {
        rooms[ws.room].players.forEach(function each(client) {
          client.send(
            JSON.stringify({
              status: 200,
              data: rooms[client.room].getGameStatus(),
            })
          );
        });
      }
    }
  });

  ws.on("close", () => {
    console.log("Connection closed!");
  });
});
