const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000; //process.env.port is for heroku(3000 is for local)


var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => { //an event listener (listening for a client to connect)
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('This user has disconnected');
  });
});

app.use(express.static(publicPath));
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
