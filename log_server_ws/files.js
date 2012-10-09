var fs = require('fs');

var files = [];
for (var i = process.argv.length - 2; i--;) {
  files.push(process.argv[i + 2]);
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
    console.log(fn);
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

module.exports = files;