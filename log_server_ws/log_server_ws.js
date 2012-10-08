var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(12345);

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

var sockets = [];

io.sockets.on('connection', function (socket) {
  sockets.push(socket);
  socket.on('disconnect', function() {
    for (var i = sockets.length; i--;) {
      if (sockets[i] == socket) {
        sockets.splice(i, 1);
      }
    }
  })
});

fs.open(process.argv[2], 'r', function(err, fd) {
    fs.watchFile(process.argv[2], function(c, p) {
        console.log(c.size - p.size);
        fs.createReadStream(process.argv[2], { start: p.size, end: c.size}).addListener("data", function(lines) {
            for (var i = sockets.length; i--;) {
                sockets[i].emit('log', {message: lines.toString()});
            }
        });
    })
});

