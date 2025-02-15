const ShareDB = require('sharedb');
const WebSocket = require('ws');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');

const backend = new ShareDB();
const wsServer = new WebSocket.Server({ port: 8080 });

wsServer.on('connection', (ws) => {
  backend.listen(new WebSocketJSONStream(ws));
});