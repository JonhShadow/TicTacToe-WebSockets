class Room {
  constructor(p1) {
    this.name = p1.room;
    this.players = [];
    this.players.push(p1);
    console.log("P1 was added to Room");
    this.gameStatus = "Waiting for our opponent!";
  }

  addP2(p2) {
    if (this.players.length == 1 && this.players[0].id != p2.id) {
      this.players.push(p2);
      this.gameStatus = "Wait for game to start!";
      return { status: 200, data: "Wait for game to start!" };
    } else if (this.players.length == 2) {
      console.log("This room is full. Choose another one our create one!");
      return {
        status: 400,
        data: "This room is full. Choose another one our create one!",
      };
    } else if (this.players[0].id == p2.id) {
      console.log("Your are already in this room");
      return { status: 400, data: "You are already in this room" };
    }
    return { status: 400, data: "Something went wrong" };
  }

  getOpponetDetails(player) {
    let p = {};
    if (this.players[0].id == player.id) {
      p["name"] = this.players[1].name;
      p["piece"] = this.players[1].piece;
    } else {
      p["name"] = this.players[0].name;
      p["piece"] = this.players[0].piece;
    }
    return p;
  }

  getGameStatus() {
    return this.gameStatus;
  }
  changeGameStatus(newStatus) {
    this.gameStatus = newStatus;
  }
  getRoomName() {
    return this.name;
  }
  removePlayer(player) {
    const index = this.players.indexOf(player);
    this.players.splice(index, 1);
  }
  numberOfPlayers() {
    return this.players.length;
  }
}
module.exports = Room;
