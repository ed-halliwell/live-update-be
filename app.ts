const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4000;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let interval: any;

io.on("connection", (socket: any) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = (socket: any) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));

// import { Client } from "pg";
// import { config } from "dotenv";
// import express from "express";
// import cors from "cors";
// import http from "http";
// import {
//   ServerToClientEvents,
//   ClientToServerEvents,
//   InterServerEvents,
//   SocketData,
// } from "./interfaces";

// import { Server } from "socket.io";

// config();

// const herokuSSLSetting = { rejectUnauthorized: false };
// const sslSetting = process.env.LOCAL ? false : herokuSSLSetting;
// const dbConfig = {
//   connectionString: process.env.DATABASE_URL,
//   ssl: sslSetting,
// };

// const app = express();
// const server = http.createServer(app);
// const io = new Server<
//   ClientToServerEvents,
//   ServerToClientEvents,
//   InterServerEvents,
//   SocketData
// >();

// app.use(express.json());
// app.use(cors());

// const client = new Client(dbConfig);
// client.connect();

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.emit("noArg");
//   socket.emit("basicEmit", 1, "2", Buffer.from([3]));
//   socket.emit("withAck", "4", (e) => {
//     // e is inferred as number
//   });

//   // works when broadcast to all
//   io.emit("noArg");

//   // // works when broadcasting to a room
//   // io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));
//   // });

//   // socket.on("chat message", (msg) => {
//   //   console.log("inside socket.on with message: ", msg);
//   //   io.emit("chat message", msg);
//   // });

//   socket.on("hello", () => {
//     console.log("hello");
//   });

//   socket.data.name = "john";
//   socket.data.age = 42;

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

// const port = process.env.PORT;
// if (!port) {
//   throw "Missing PORT environment variable.  Set it in .env file.";
// }
// server.listen(port, () => {
//   console.log(`Server is up and running on port ${port}`);
// });
