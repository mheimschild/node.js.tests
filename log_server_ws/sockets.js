var app = require('http'), io = require('socket.io'), fs = require('fs');

var socket_module = {
  init: function(publisher, init_value) {
    app = app.createServer(handler);
    app.listen(12345);
    io = io.listen(app);

    io.sockets.on('connection', function (socket) {
      socket.emit('init', { message: init_value } );
      publisher.subscribe_for_all(init_value, socket);
      socket.on('disconnect', function() {
        publisher.unsubscribe_from_all(socket);
      });
      socket.on('subscribe', function(data) {
        publisher.subscribe(data.file, socket);
      });

      socket.on('unsubscribe', function(data) {
        publisher.unsubscribe(data.file, socket);
      });
    });
  }
}

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

module.exports = socket_module;