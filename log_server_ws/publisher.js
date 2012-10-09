var publisher = {
  subscriptions: {},

  subscribe: function(file, socket) {
    if (this.subscriptions[file] == undefined) {
      this.subscriptions[file] = [];
    }
    this.subscriptions[file].push(socket);
  },

  subscribe_for_all: function(files, socket) {
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

module.exports = publisher;