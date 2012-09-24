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
});

// TODO: io disconection

fs.open(process.argv[2], 'r', function(err, fd) {
    fs.watchFile(process.argv[2], function(c, p) {
        fs.read(fd, new Buffer(c.size - p.size), 0, c.size - p.size, p.size, function(err, br, b) {
            console.log("file changed");
            for (var i = sockets.length; i--;) {
                sockets[i].emit('log', {message: b.toString()});
            }
        });
    })
});

