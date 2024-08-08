// config
import "./config/config.js";

// imports
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Router from "./routes.js";
import http from "http";
import { Server } from "socket.io";

// initialize express
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// set up body parser
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// set up cors
app.use(cors());

// set up static files
app.use("/uploads", express.static("uploads"));

// set up routes
app.use("/", Router);

// set up sockets
io.on("connection", (socket) => {
  console.log("User connected >> " + socket.id);
  // handle joining a room (room ~ lecture _id)
  socket.on("join", ({ room }) => {
    socket.join(room);
  });
  // handle doubts
  socket.on("doubts", ({ room, doubts, time }) => {
    io.to(room).emit("doubts", { doubts, time});
  });
  // handle messages
  socket.on("message", ({ room, from, fromName, text }) => {
    io.to(room).emit("message", { from, fromName, text, date: new Date().toISOString() });
  });
  // handle stream
  socket.on("stream", ({ room, peerId }) => {
    console.log(room, peerId);
    io.to(room).emit("stream", { peerId });
  });
  // handle disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected >> " + socket.id);
  });
});

// listen
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
