import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";

import { Server } from "socket.io";

config();

const herokuSSLSetting = { rejectUnauthorized: false };
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting;
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cors());

const client = new Client(dbConfig);
client.connect();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// app.get("/", async (req, res) => {
//   // res.send("<h1>Hello back end app</h1>");
//   // const dbres = await client.query("select * from categories");
//   // res.json(dbres.rows);
// });

const port = process.env.PORT;
if (!port) {
  throw "Missing PORT environment variable.  Set it in .env file.";
}
server.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
