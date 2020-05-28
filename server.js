const app = require("express")();
const helmet = require("helmet");
app.use(helmet());
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    if (req.headers["x-forwarded-proto"] !== "https")
      return res.redirect("https://" + req.headers.host + req.url);
    else return next();
  } else return next();
});
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const NUMBERUSERSCHAMELEON = 3;

// fake DB
var users = {};
var roomsStarted = {};
var letters = ["A", "B", "C", "D"];
var numbersChameleon = ["1", "2", "3", "4"];
var gameStarted = false;

// socket.io server for test
const chameleon = io.of("/chameleon");
chameleon.on("connection", (socket) => {
  console.log("someone connected");
  socket.on("user", (data) => {
    username = data[0];
    room = data[1];
    chameleon.in(room).clients((err, clients) => {
      let usernameConflict = false;
      let currentlyConnectedRoomClients = [];
      for (let clientId of clients) {
        let clientSocket = chameleon.in(room).sockets[clientId];
        if (clientSocket.username === username) {
          usernameConflict = true;
          console.log(clientSocket.username, username, room);
        }
        currentlyConnectedRoomClients.push(clientSocket.username);
      }
      if (!usernameConflict) {
        if (socket.room) {
          socket.leave(socket.room);
        }
        socket["username"] = username;
        socket.join(room);
        socket["room"] = room;
        currentlyConnectedRoomClients.push(username);
        console.log("curr connected", currentlyConnectedRoomClients);
        users[room] = currentlyConnectedRoomClients;
        // TODO switch false to gamestarted
        socket.emit("acceptedUser", [username, false]);
        chameleon
          .in(room)
          .emit("connectedUsers", currentlyConnectedRoomClients);
        if (currentlyConnectedRoomClients.length >= NUMBERUSERSCHAMELEON) {
          chameleon.in(room).emit("allowStartGame");
        }
      } else {
        console.log("Conflict");
        socket.emit("rejectedUser");
      }
    });
  });

  socket.on("leaveGame", (data) => {
    console.log("leaving game", data);
    try {
      roomUsers = users[socket.room];
      roomUsers =
        roomUsers &&
        roomUsers.filter(function (val) {
          return val !== socket.username;
        });
      console.log(roomUsers);
      socket.emit("leftGame", socket.username);
      users[socket.room] = roomUsers;
      chameleon.in(socket.room).emit("connectedUsers", roomUsers);
      if (roomUsers && roomUsers.length < NUMBERUSERSCHAMELEON) {
        chameleon.in(socket.room).emit("denyStartGame");
      }
      delete socket.username;
      socket.leave(socket.room);
      delete socket.room;
    } catch (ex) {
      console.log(ex);
    }
  });

  socket.on("startGame", () => {
    chameleon.in(socket.room).clients((err, clients) => {
      var socketIds = clients;
      shuffle(socketIds);
      var chosenChamaleonSocket =
        socketIds[(socketIds.length * Math.random()) << 0];
      var randomLetter = letters[(letters.length * Math.random()) << 0];
      var randomNumber =
        numbersChameleon[(numbersChameleon.length * Math.random()) << 0];
      var randomGrid = randomLetter + randomNumber;
      var chameleonIndex = 0;
      socketIds.forEach((socketId, index) => {
        if (socketId !== chosenChamaleonSocket) {
          chameleon.to(socketId).emit("assignedGrid", [randomGrid, index + 1]);
        } else {
          chameleonIndex = index;
        }
      });
      chameleon
        .to(chosenChamaleonSocket)
        .emit("assignedChameleon", chameleonIndex + 1);
      roomsStarted[socket.room] = true;
    });
  });

  socket.on("resetGame", () => {
    roomsStarted[socket.room] = false;
    chameleon.in(socket.room).emit("resetGame");
  });

  socket.on("disconnect", function () {
    roomUsers = users[socket.room];
    roomUsers =
      roomUsers &&
      roomUsers.filter(function (val) {
        return val !== socket.username;
      });
    console.log(roomUsers);
    chameleon.in(socket.room).emit("connectedUsers", roomUsers);
    if (roomUsers && roomUsers.length < NUMBERUSERSCHAMELEON) {
      gameStarted = false;
      console.log("game not started");
      chameleon.in(socket.room).emit("denyStartGame");
    }
    delete socket.username;
    socket.leave(socket.room);
    delete socket.room;
  });
});

nextApp.prepare().then(() => {
  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`);
  });
});

var shuffle = function (array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};
