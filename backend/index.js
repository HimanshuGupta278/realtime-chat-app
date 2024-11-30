const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update for production
  },
});

let rooms = [];

io.on('connection', (socket) => {
  const sid = socket.id;
  console.log('User connected, sid: ', sid);

  // Create Room
  socket.on('create room', (roomId) => {
    const existingRoom = rooms.find((room) => room.roomId === roomId);
    if (existingRoom) {
      socket.emit('error', `Room ID ${roomId} already exists.`);
      return;
    }
    socket.join(roomId);
    const room = { roomId, users: [sid] };
    rooms.push(room);
    console.log(rooms);
    console.log(`sid: ${sid} created, room ID: ${roomId}`);
    socket.emit('connected', roomId);
  });

  // Join Room
  socket.on('join room', (roomId) => {
    const room = rooms.find((room) => room.roomId === roomId);
    if (!room) {
      socket.emit('error', `Room ID ${roomId} does not exist.`);
      return;
    }
    socket.join(roomId);
    room.users.push(sid);
    io.to(roomId).emit('user joined', sid);
    socket.emit('connected', roomId);
    console.log(rooms);
    console.log(`sid: ${sid} joined, room ID: ${roomId}`);
  });

  // Chat Message
  socket.on('chat', (msg) => {
    console.log(msg);
    socket.broadcast.to(msg.roomId).emit('chat', msg);
  });

  // Handle Disconnect
  socket.on('disconnect', () => {
    rooms.forEach((room) => {
      room.users = room.users.filter((user) => user !== sid);
    });
    rooms = rooms.filter((room) => room.users.length > 0); // Remove empty rooms
    console.log(`User disconnected: ${sid}`);
    console.log(rooms);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
