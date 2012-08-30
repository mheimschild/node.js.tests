var fs = require('fs');
var net = require('net');

fs.open(process.argv[2], 'r', function(err, fd) {
    var sockets = [];
    var server = net.createServer(function(s) {
        sockets.push(s);
        s.on('end', function() {
            for (var i = sockets.length; i--;) {
                if (sockets[i] == s) {
                    sockets.splice(i, 1);
                }
            }
        })
    });
    server.listen(12345, 'localhost');

    fs.watchFile(process.argv[2], function(c, p) {
        fs.read(fd, new Buffer(c.size - p.size), 0, c.size - p.size, p.size, function(err, br, b) {
            for (var i = sockets.length; i--; ) {
                sockets[i].write(b.toString());
                sockets[i].pipe(sockets[i]);
            }
        });
    })
});

