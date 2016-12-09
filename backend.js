const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(request, response){
    response.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('draw', function(coord_pair){
      console.log(coord_pair);
      socket.broadcast.emit('draw', coord_pair);
  });
});

http.listen(8000, function (){
    console.log('Listing on 8000');
});
