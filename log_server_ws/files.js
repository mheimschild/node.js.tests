var fs = require('fs');

var files = {
  files: [],
  sizes: {},

  init: function(publisher) {
    this.publisher = publisher;

    for (var i = process.argv.length - 2; i--;) {
      this.files.push(process.argv[i + 2]);
    }

    var that = this;

    for (var i = this.files.length; i--;) {
      var file_name = this.files[i];
      fs.stat(file_name, function(error, stat) {
        if (error) {
          return;
        }

        that.sizes[file_name] = stat.size;
      });

      fs.watch(file_name, this.createWatchCallback(file_name));
    }
  },

  createWatchCallback: function(file_name) {
    var that = this;
    return function(event, fn) {
      var fn = file_name;
      if ("change" != event) {
        return;
      }

      fs.stat(fn, function(error, stat) {
        var p_size = that.sizes[fn];
        var c_size = stat.size;

        fs.createReadStream(fn, { start: p_size > c_size ? 0 : p_size, end: c_size}).addListener("data", function(lines) {
          that.publisher.publish(fn, {message: lines.toString()});
          that.sizes[fn] = c_size;
        });
      });
    }
  }
};

module.exports = files;
