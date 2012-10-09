var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

app.listen(12345);

var files = [];
for (var i = process.argv.length - 2; i--;) {
  files.push(process.argv[i + 2]);
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

io.sockets.on('connection', function (socket) {
  socket.emit('init', { message: files });
  publisher.subscribe_for_all(socket);
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

var publisher = {
  subscriptions: {},

  subscribe: function(file, socket) {
    if (this.subscriptions[file] == undefined) {
      this.subscriptions[file] = [];
    }
    this.subscriptions[file].push(socket);
  },

  subscribe_for_all: function(socket) {
    for (var i = files.length; i--; ) {
      this.subscribe(files[i], socket);
    }
  },

  unsubscribe: function(file, socket) {
    for (var i = this.subscriptions[file].length; i--;) {
      if (this.subscriptions[file][i] == socket) {
        this.subscriptions[file].splice(i, 1);
      }
    }
  },

  unsubscribe_from_all: function(socket) {
    for (file in this.subscriptions) {
      this.unsubscribe(file, socket);
    }
  },

  publish: function(fn, data) {
    if (undefined == this.subscriptions[fn]) {
      return;
    }
    for (var i = this.subscriptions[fn].length; i--;) {
      this.subscriptions[fn][i].emit('log', data);
    }
  }
}

var sizes = {};

for (var i = files.length; i--;) {
  var file_name = files[i];
  fs.stat(file_name, function(error, stat) {
    if (error) {
      return;
    }

    sizes[file_name] = stat.size;
  });

  fs.watch(file_name, function(event, fn) {
    if ("change" != event) {
      return;
    }

    fs.stat(fn, function(error, stat) {
      var p_size = sizes[fn];
      var c_size = stat.size;

      fs.createReadStream(fn, { start: p_size > c_size ? 0 : p_size, end: c_size}).addListener("data", function(lines) {
        publisher.publish(fn, {message: lines.toString()});
        sizes[fn] = c_size;
      });
    });
  });
}