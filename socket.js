const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");

const port = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // ganti sesuai frontend dev kamu
  },
});

require("./src/socket")(io);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
