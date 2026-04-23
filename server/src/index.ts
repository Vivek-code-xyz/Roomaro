import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '';
const ALLOWED_ORIGINS = CLIENT_ORIGIN
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin?: string) => {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.length === 0) return true;
  return ALLOWED_ORIGINS.includes(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, uptime: process.uptime() });
});

app.get('/', (_req, res) => {
  res.status(200).json({
    service: 'roomaro-realtime-server',
    status: 'online',
    health: '/health',
  });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3004;
const ROOM_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

interface User {
  id: string;
  username: string;
  avatar: string;
}

interface Room {
  name: string;
  users: Map<string, User>;
}

// In-memory storage for rooms
const rooms = new Map<string, Room>();
const deletionTimeouts = new Map<string, NodeJS.Timeout>();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send current room list on connection
  socket.emit('room_list_update', getRoomListData());

  socket.on('get_rooms', () => {
    socket.emit('room_list_update', getRoomListData());
  });

  socket.on('create_room', (roomName: string) => {
    if (rooms.has(roomName)) {
      socket.emit('error', { message: 'Room already exists' });
      return;
    }

    const newRoom: Room = {
      name: roomName,
      users: new Map(),
    };
    rooms.set(roomName, newRoom);
    
    io.emit('room_list_update', getRoomListData());
  });

  socket.on('join_room', ({ roomName, username, avatar }: { roomName: string, username: string, avatar: string }) => {
    // If a deletion timer exists for this room, cancel it
    if (deletionTimeouts.has(roomName)) {
      clearTimeout(deletionTimeouts.get(roomName)!);
      deletionTimeouts.delete(roomName);
      console.log(`Room deletion canceled for: ${roomName}`);
    }

    let room = rooms.get(roomName);
    
    // If room doesn't exist but is being joined (via direct link), create it
    if (!room) {
      room = {
        name: roomName,
        users: new Map(),
      };
      rooms.set(roomName, room);
    }

    socket.join(roomName);
    room.users.set(socket.id, { id: socket.id, username, avatar });

    // Notify others
    socket.to(roomName).emit('receive_message', {
      id: Date.now().toString(),
      username: 'System',
      avatar: 'Info',
      text: `${username} joined the room`,
      timestamp: new Date().toISOString(),
      isSystem: true
    });

    // Broadcast updated counts
    io.emit('room_list_update', getRoomListData());
    console.log(`${username} joined room: ${roomName}`);
  });

  socket.on('send_message', ({ roomName, text, username, avatar, clientMessageId }: { roomName: string, text: string, username: string, avatar: string, clientMessageId?: string }) => {
    if (!text.trim()) return;

    const room = rooms.get(roomName);
    if (!room || !room.users.has(socket.id)) {
      socket.emit('error', { message: 'Join the room before sending messages' });
      return;
    }

    const message = {
      id: Math.random().toString(36).substring(7),
      clientMessageId,
      username,
      avatar,
      text,
      timestamp: new Date().toISOString(),
    };

    io.to(roomName).emit('receive_message', message);
  });

  socket.on('leave_room', (roomName: string) => {
    handleLeaveRoom(socket.id, roomName);
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach(roomName => {
      if (roomName !== socket.id) {
        handleLeaveRoom(socket.id, roomName);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  function handleLeaveRoom(socketId: string, roomName: string) {
    const room = rooms.get(roomName);
    if (!room) return;

    const user = room.users.get(socketId);
    if (user) {
      room.users.delete(socketId);
      socket.leave(roomName);

      socket.to(roomName).emit('receive_message', {
        id: Date.now().toString(),
        username: 'System',
        avatar: 'Info',
        text: `${user.username} left the room`,
        timestamp: new Date().toISOString(),
        isSystem: true
      });

      // If room is empty, start 10-minute expiry timer
      if (room.users.size === 0) {
        console.log(`Starting 10m deletion timer for room: ${roomName}`);
        const timeout = setTimeout(() => {
          rooms.delete(roomName);
          deletionTimeouts.delete(roomName);
          io.emit('room_list_update', getRoomListData());
          console.log(`Room permanently deleted due to inactivity: ${roomName}`);
        }, ROOM_EXPIRY_MS);
        
        deletionTimeouts.set(roomName, timeout);
      }

      io.emit('room_list_update', getRoomListData());
    }
  }
});

function getRoomListData() {
  const data = Array.from(rooms.values()).map(r => ({
    name: r.name,
    userCount: r.users.size
  }));
  console.log('Room list status updated. Total rooms:', data.length);
  return data;
}

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (ALLOWED_ORIGINS.length > 0) {
    console.log(`CORS allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
  } else {
    console.log('CORS allowed origins: all (CLIENT_ORIGIN not set)');
  }
});
