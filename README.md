
# Day 4: Real-Time Collaboration & DevOps Workshop

![Real-Time Collaboration](https://img.shields.io/badge/Real_Time-Collab-blue)
![Docker](https://img.shields.io/badge/Container-Docker-green)
![CI/CD](https://img.shields.io/badge/CI_CD-GitHub_Actions-orange)

Hands-on implementation of real-time collaboration features and DevOps practices.

## Table of Contents
- [Real-Time Chat App](#real-time-chat-app)
- [Collaborative Text Editor](#collaborative-text-editor)
- [Docker Setup](#docker-containerization)
- [CI/CD Pipeline](#cicd-with-github-actions)
- [Homework Extension](#homework-extension)
- [Key Takeaways](#key-takeaways)

---

## Real-Time Chat App
**WebSocket-based chat application using Socket.IO**

### Setup
```bash
npm init -y
npm install express socket.io
```

### File Structure
```
├── server.js
└── public/
    └── index.html
```

**server.js**
```javascript
const express = require('express');
const socketIO = require('socket.io');
const app = express();
const server = app.listen(3000);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('New connection');
  
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});
```

**public/index.html**
```html
<!DOCTYPE html>
<html>
<body>
  <ul id="messages"></ul>
  <form id="chat-form">
    <input id="message-input" autocomplete="off"/>
    <button>Send</button>
  </form>

  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io();
    document.getElementById('chat-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('message-input');
      if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
      }
    });

    socket.on('chat message', (msg) => {
      const li = document.createElement('li');
      li.textContent = msg;
      document.getElementById('messages').appendChild(li);
    });
  </script>
</body>
</html>
```

**Run**: `node server.js` → Open `localhost:3000` in multiple browsers

---

## Collaborative Text Editor
**Basic OT implementation using ShareDB**

### Setup
```bash
npm install sharedb ws express
```
```
npm install sharedb ws @teamwork/websocket-json-stream
```
### File Structure
```
├── editor-server.js
└── public/
    └── editor.html
```

**editor-server.js**
```javascript
const ShareDB = require('sharedb');
const WebSocket = require('ws');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');

const backend = new ShareDB();
const wsServer = new WebSocket.Server({ port: 8080 });

wsServer.on('connection', (ws) => {
  backend.listen(new WebSocketJSONStream(ws));
});
```

**public/editor.html**
```html
<!DOCTYPE html>
<html>
<body>
  <textarea id="editor" cols="80" rows="20"></textarea>
  
  <script src="https://unpkg.com/sharedb-client-browser/dist/sharedb.js"></script>
  <script>
    const connection = new sharedb.Connection(new WebSocket('ws://localhost:8080'));
    const doc = connection.get('examples', 'textarea');
    
    doc.subscribe(() => {
      document.getElementById('editor').value = doc.data.content || '';
      document.getElementById('editor').addEventListener('input', (e) => {
        doc.submitOp([{ p: ['content'], oi: e.target.value }]);
      });
      doc.on('op', () => document.getElementById('editor').value = doc.data.content);
    });
  </script>
</body>
</html>
```

**Run**: `node editor-server.js` → Open `localhost:8080` in multiple tabs

---

## Docker Containerization
**Containerize the chat application**

### Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Commands
```bash
docker build -t chat-app .
docker run -p 3000:3000 chat-app
```

---

## CI/CD with GitHub Actions
**Automated testing pipeline**

### Workflow File (.github/workflows/ci.yml)
```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - run: npm install
    - run: npm test
```

### Package.json Script
```json
"scripts": {
  "test": "mocha test/*.js"
}
```

---

## Homework Extension
**Enhanced chat app with message persistence**

```javascript
// In server.js
let messages = [];
io.on('connection', (socket) => {
  socket.emit('message history', messages);
  
  socket.on('chat message', (msg) => {
    messages.push(msg);
    io.emit('chat message', msg);
  });
});
```

---

## Key Takeaways
- 🚀 **Real-Time Communication**: WebSocket/Socket.IO for instant messaging
- ✍️ **Collaborative Editing**: Operational Transformation (OT) basics
- 🐳 **Containerization**: Docker packaging and deployment
- 🔄 **CI/CD**: Automated testing with GitHub Actions

```

This README provides complete implementation details with code samples, verification steps, and DevOps configurations. Copy to a `README.md` file and use with your project!
