class UserInforService {
    handleEditInfo(socket, data) {
        socket.broadcast.emit('editInfo', data);
    }
    activeEditInfo(socket,data) {
        socket.broadcast.emit('activeEditInfo',data);
    }
    confirmInfo(socket,data) {
        socket.broadcast.emit('confirmInfo',data);
    }
}

module.exports = UserInforService;