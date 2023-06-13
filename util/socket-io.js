let io;
module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket io is not initialised');
    }
    return io;
  },
  matchReqNSendNotification: (reqUserId, payload, event) => {
    if (!io) {
      throw new Error('Socket io is not initialised');
    }
    let sockets = io.sockets.sockets;
    for (var socketId in sockets) {
      var userid = sockets[socketId].handshake.query.userid;
      if (reqUserId.indexOf(userid) !== -1) {
        io.to(socketId).emit(event, payload);
      }
    }
    return true;
  },
  expemtActionTakingId: (arr, exmpId) => {
    let filterArr = arr.filter(function (obj) {
      return String(obj._id) !== String(exmpId);
    });
    return filterArr;
  },
};
