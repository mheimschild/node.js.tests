Simple web socket log server
============================

The server is listening on port 12345 and sending log file deltas through web socket.

Server side
-----------
install socket.io

`npm install socket.io`

and than start `node log_server.js your_logfile.log`

Client side
-----------

Open http://yourserver:12345/index.html in your web browser.

Tested with:
* Google Chrome 21
* IE9
* Firefox 15
