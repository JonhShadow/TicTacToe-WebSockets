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
  ws.on("message", (msg) => {
    data = JSON.parse(msg);
    if (data["status"] == "move") {
      console.log(data);
      if (rooms[ws.room].players[0] == ws) {
        rooms[ws.room].players[1].send(JSON.stringify(data));
      } else {
        rooms[ws.room].players[0].send(JSON.stringify(data));
      }
    } else if (data["status"] == "restart") {
      console.log(data);
      if (rooms[ws.room].gameStatus == data["gameStatus"]) {
        rooms[ws.room].players.forEach(function each(client) {
          client.send(
            JSON.stringify({
              status: "restart",
              data: rooms[client.room].getGameStatus(),
            })
          );
        });
      } else {
        rooms[ws.room].changeGameStatus(data["gameStatus"]);
      }
    } else {
      user = data;
      ws.id = wss.getUniqueID();
      ws.name = user.name;
      ws.room = user.room;

      console.log("New Client:" + ws.name);
      if (!rooms[ws.room]) {
        ws.piece = "x";
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
        ws.piece = "o";
        let feedback = rooms[ws.room].addP2(ws);
        if (feedback["status"] == 200) {
          rooms[ws.room].players.forEach(function each(client) {
            let opponetDetails = rooms[client.room].getOpponetDetails(client);
            client.send(
              JSON.stringify({
                status: "opponetDetails",
                data: opponetDetails,
              })
            );
            client.send(
              JSON.stringify({
                status: 200,
                data: rooms[client.room].getGameStatus(),
              })
            );
          });
        } else if (feedback["status"] == 400) {
          ws.send(
            JSON.stringify({
              status: 400,
              data: feedback["data"],
            })
          );
        }
      }
    }
  });

  ws.on("close", () => {
    console.log(ws.name + "-> connection closed!");
    rooms[ws.room].removePlayer(ws);
    rooms[ws.room].changeGameStatus("opponent left");
    rooms[ws.room].players.forEach(function each(client) {
      client.send(
        JSON.stringify({
          status: "disconecting",
          data: rooms[client.room].getGameStatus(),
        })
      );
    });

    if (rooms[ws.room].numberOfPlayers() == 0) {
      console.log(ws.room + " was deleted");
      delete rooms[ws.room];
    }
  });
});
