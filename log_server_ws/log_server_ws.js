var app = require('./sockets'), publisher = require('./publisher'), files = require('./files');

files.init(publisher);
app.init(publisher, files.files);