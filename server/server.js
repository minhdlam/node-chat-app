const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000; //process.env.port is for heroku(3000 is for local)
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users(); //a new instance of the users class and being able to use its methods

io.on('connection', (socket) => { //an event listener (listening for a client to connect)
  console.log('New user connected');



  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) { //Testing to see if the user inputs in the text fields are string valid
      return callback('Name and room name are required.'); //the return is to make sure the code below don't fire if input fields are missing
    }
    socket.join(params.room); //a place for people in the same room to talk
    // the opposite is socket.leave()
    users.removeUser(socket.id); //removing the user from any previous room then adding to the new list
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', `Welcome ${params.name}`));
    //socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`)); //alerting other users that someone new has joined
    callback();
  });

  socket.on('createMessage', (message, callback) => { //socket sends to one connection
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) { //only sending if there is a user and what they typed is a string
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text)); //only sending the messages to people in this specific room
    }
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if (user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude)); //receiving the coordinates from index.js
    }

  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id); //removing a user once they disconnect and getting their id

    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room)); //getting a new list once the user leaves
      //io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`)); //telling the people that user has left
    }
  });
});

app.use(express.static(publicPath));
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
