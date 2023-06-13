const app = require('../app');
const config = require('../config/config');
const mongoose = require('mongoose');

var port = process.env.PORT || 5000;

mongoose
  .connect(config.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((result) => {
    const server = app.listen(port, function () {
      console.log('Express server listening on port ' + port);
    });
    const io = require('../util/socket-io').init(server);
    io.on('connection', (socket) => {
      console.log(
        'Client connected ' + socket.id,
        socket.handshake.query.userid
      );
      socket.on('disconnect', () => {
        console.log('Client disconnected ' + socket.id);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
