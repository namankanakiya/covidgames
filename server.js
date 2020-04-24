const app = require("express")();
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
var letters = ["A", "B", "C", "D"];
var numbersChameleon = ["1", "2", "3", "4"];
var gameStarted = false;

// socket.io server for test
const chameleon = io.of("/chameleon");
chameleon.on("connection", (socket) => {
  console.log("someone connected");
  socket.on("user", (data) => {
    console.log(data);
    console.log(Object.values(users));
    console.log(Object.values(users).indexOf(data) < 0);
    if (Object.values(users).indexOf(data) < 0) {
      users[socket.id] = data;
      console.log(data);
      console.log(users);
      socket.emit("acceptedUser", [data, gameStarted]);
      var objectVals = Object.values(users);
      socket.emit("connectedUsers", objectVals);
      socket.broadcast.emit("connectedUsers", objectVals);
      if (objectVals.length >= NUMBERUSERSCHAMELEON) {
        chameleon.emit("allowStartGame");
        // socket.emit("allowStartGame");
        // socket.broadcast.emit("allowStartGame");
      }
    } else {
      socket.emit("rejectedUser");
    }
  });

  socket.on("leaveGame", (data) => {
    console.log("leaving game", data);
    try {
      delete users[socket.id];
      console.log(users);
      socket.emit("leftGame", data);
      var objectVals = Object.values(users);
      chameleon.emit("connectedUsers", objectVals);
      // socket.emit("connectedUsers", objectVals);
      // socket.broadcast.emit("connectedUsers", objectVals);
      if (objectVals.length < NUMBERUSERSCHAMELEON) {
        chameleon.emit("denyStartGame");
        // socket.emit("denyStartGame");
        // socket.broadcast.emit("denyStartGame");
      }
    } catch (ex) {
      console.log(ex);
    }
  });

  socket.on("startGame", () => {
    var socketIds = Object.keys(users);
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
    gameStarted = true;
  });

  socket.on("resetGame", () => {
    gameStarted = false;
    chameleon.emit("resetGame");
  });

  socket.on("disconnect", function () {
    delete users[socket.id];
    var objectVals = Object.values(users);
    socket.broadcast.emit("connectedUsers", objectVals);
    if (objectVals.length < NUMBERUSERSCHAMELEON) {
      gameStarted = false;
      console.log("game not started");
      socket.broadcast.emit("denyStartGame");
    }
    console.log(Object.values(users));
  });
});

nextApp.prepare().then(() => {
  app.get("/users", (req, res) => {
    console.log("got request");
    res.json(Object.values(users));
  });

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
