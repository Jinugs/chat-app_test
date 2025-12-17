const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./chat.db');
db.run(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

console.log('✅ Server starting...');

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  setTimeout(() => {
    db.all(`SELECT * FROM messages ORDER BY timestamp ASC LIMIT 50`, 
      (err, rows) => {
        if (!err) {
          console.log(`📤 History (${rows.length} msgs) → ${socket.id}`);
          socket.emit('history', rows);
        }
      }
    );
  }, 100);

  socket.on('loadHistory', () => {
    db.all(`SELECT * FROM messages ORDER BY timestamp ASC LIMIT 50`, 
      (err, rows) => {
        if (!err) {
          socket.emit('history', rows);
        }
      }
    );
  });

  socket.on('message', (data) => {
    console.log('📨 New:', data);
    const { user, message } = data;
    
    db.run(`INSERT INTO messages (user, message) VALUES (?, ?)`,
      [user, message], function(err) {
        if (!err) {
          const newMessage = {
            id: this.lastID,
            user, message,
            timestamp: new Date().toISOString()
          };
          io.emit('message', newMessage);  
          console.log('✅ Broadcasted');
        }
      }
    );
  });

  socket.on('disconnect', () => {
    console.log('❌ User left:', socket.id);
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
