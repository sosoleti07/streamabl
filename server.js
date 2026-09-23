const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const rooms = new Map();

app.use((req, res, next) => {
  // Permissions Policy keeps camera/microphone available to this first-party page.
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self), fullscreen=(self)');
  next();
});

app.use(express.static(path.join(__dirname, 'public'), { index: 'index.html', maxAge: 0 }));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/rtc-config.js', (_req, res) => {
  const turnUrl = process.env.TURN_URL || '';
  const turnUsername = process.env.TURN_USERNAME || '';
  const turnCredential = process.env.TURN_CREDENTIAL || '';
  res.type('application/javascript').send(
    `window.__RTC_CONFIG__ = ${JSON.stringify({ turnUrl, turnUsername, turnCredential })};`
  );
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, ack) => {
    const room = String(roomId || '').trim().toUpperCase();
    if (!room || room.length > 32) {
      return ack?.({ ok: false, error: 'Salon invalide.' });
    }

    let members = rooms.get(room);
    if (!members) {
      members = { users: new Set(), media: null };
      rooms.set(room, members);
    }

    if (members.users.size >= 2 && !members.users.has(socket.id)) {
      return ack?.({ ok: false, error: 'Ce salon est déjà complet (2 personnes maximum).' });
    }

    members.users.add(socket.id);
    socket.join(room);
    socket.data.room = room;

    const memberIds = [...members.users];
    const initiator = memberIds.length === 1;
    ack?.({ ok: true, room, initiator });

    if (members.media && memberIds.length === 2) {
      socket.emit('shared-video-state', members.media);
    }

    if (members.users.size === 2) {
      for (const memberId of members.users) {
        io.to(memberId).emit('room-ready', { initiator: memberId === memberIds[0] });
      }
    }
  });

  socket.on('signal', ({ room, data }) => {
    const currentRoom = socket.data.room;
    if (!currentRoom || currentRoom !== room || !data) return;
    socket.to(currentRoom).emit('signal', data);
  });

  socket.on('video-command', ({ room, action, url, mediaType, currentTime, playing }) => {
    const currentRoom = socket.data.room;
    if (!currentRoom || currentRoom !== room) return;

    const members = rooms.get(currentRoom);
    if (!members) return;

    if (action === 'load') {
      members.media = {
        url: String(url || '').trim(),
        mediaType: mediaType === 'youtube' ? 'youtube' : 'direct',
        currentTime: Number.isFinite(Number(currentTime)) ? Number(currentTime) : 0,
        playing: Boolean(playing)
      };
    } else if (members.media) {
      if (Number.isFinite(Number(currentTime))) members.media.currentTime = Number(currentTime);
      if (typeof playing === 'boolean') members.media.playing = playing;
    }

    socket.to(currentRoom).emit('video-command', {
      action,
      url: members.media?.url || String(url || '').trim(),
      mediaType: members.media?.mediaType || (mediaType === 'youtube' ? 'youtube' : 'direct'),
      currentTime: members.media?.currentTime || 0,
      playing: Boolean(members.media?.playing)
    });
  });

  socket.on('clear-shared-video', (room) => {
    const currentRoom = socket.data.room;
    if (!currentRoom || currentRoom !== room) return;
    const members = rooms.get(currentRoom);
    if (!members) return;
    members.media = null;
    socket.to(currentRoom).emit('clear-shared-video');
  });

  socket.on('leave-room', () => {
    leaveCurrentRoom(socket);
  });

  socket.on('disconnect', () => {
    leaveCurrentRoom(socket);
  });
});

function leaveCurrentRoom(socket) {
  const room = socket.data.room;
  if (!room) return;

  const members = rooms.get(room);
  if (members) {
    members.users.delete(socket.id);
    socket.to(room).emit('peer-left');
    if (members.users.size === 0) rooms.delete(room);
  }

  socket.leave(room);
  socket.data.room = null;
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur vidéo lancé sur le port ${PORT}`);
});
