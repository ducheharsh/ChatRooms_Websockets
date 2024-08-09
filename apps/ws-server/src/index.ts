import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import client from "@repo/db/client";
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const randomName: string = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals]
});

console.log(randomName);

io.on("connection", (socket) => {
  const customConfig: Config = {
    dictionaries: [animals],
    length: 1,
    seed: socket.id,
  };
  console.log("User connected: ", socket.id);
  const name = uniqueNamesGenerator(customConfig);

  socket.on("connected", () => {
    console.log("User connected: ", { name, id: socket.id });
    socket.emit("connected", { name, id: socket.id });
  });

  socket.on("createRoom", async (room) => {
    try {
      const roomData = await client.rooms.findUnique({
        where: {
          id: room
        }
      });

      if (!roomData) {
        const newroom = await client.rooms.create({
          data: {
            id: room,
            users: {
              create: {
                id: socket.id,
                name: name
              }
            }
          }
        });
        socket.join(room);
        console.log("New room created: ", newroom);
      } else {
        return socket.emit("error", "Room already exists");
      }
    } catch (err) {
      console.log("createRoomError: ", err);
    }
  });

  socket.on("joinRoom", async (room) => {
    try {
      const roomData = await client.rooms.findUnique({
        where: {
          id: room
        }
      });

      if (roomData) {
        const user = await client.users.create({
          data: {
            id: socket.id,
            name: name,
            room: {
              connect: {
                id: room
              }
            }
          }
        });

        socket.join(room);
        socket.broadcast.to(room).emit("joinedMembers", user);
        console.log("User joined room: ", user);
      } else {
        return socket.emit("error", "Room does not exist");
      }
    } catch (err) {
      console.log("joinRoomError: ", err);
    }
  });

  socket.on("joinedMembers", (data)=>{
    console.log("Joined members: ", data);
    socket.broadcast.to(data.room).emit("joinedMembers", data );
  })

  socket.on("send_message", (data) => {
    socket.join(data.room);
    console.log("Message received: ", `${data.message} in room ${data.room}`);
    socket.broadcast.to(data.room).emit("received_message", `${name}: ${data.message}`);
  });

});

server.listen(3002, () => {
  console.log("Server running on port 3002");
});