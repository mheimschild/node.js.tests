var app = require('./sockets'), publisher = require('./publisher'), files = require('./files');

app.init(publisher, files);