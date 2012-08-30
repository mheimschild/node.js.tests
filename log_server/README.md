Simple log server
=================

This server listening on port 12345 sends log file deltas through TCP socket.

Server side
-----------

just start "node log_server.js your_logfile.log"

Client side
-----------

and connect with telnet to your server "telnet your_server 12345"

Surely not sophisticated enough for productive usage but as a small and quick tool goof enough.