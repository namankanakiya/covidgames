const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// fake DB
var users = {};

// socket.io server for test
const testNsp = io.of("/test");
testNsp.on("connection", (socket) => {
  console.log("someone connected");
  socket.on("user", (data) => {
    console.log(data);
    console.log(Object.values(users));
    console.log(Object.values(users).indexOf(data) < 0);
    if (Object.values(users).indexOf(data) < 0) {
      users[socket.id] = data;
      console.log(data);
      console.log(users);
      socket.emit("connectedUsers", Object.values(users));
      socket.broadcast.emit("connectedUsers", Object.values(users));
    }
  });

  socket.on("disconnect", function () {
    delete users[socket.id];
    socket.broadcast.emit("connectedUsers", Object.values(users));
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

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
