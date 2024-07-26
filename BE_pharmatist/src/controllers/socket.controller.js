const UserInforService = require('../services/socket/user-info.service');

class SocketController {
  constructor(socket) {
    this.socket = socket;
    this.userInforService = new UserInforService();
    this.initializeListeners();
  }

  initializeListeners() {
    this.socket.on('activeEditInfo', (data) => this.userInforService.activeEditInfo(this.socket, data));
    this.socket.on('editInfo', (data) => this.userInforService.handleEditInfo(this.socket, data));
    this.socket.on('confirmInfo', (data) => this.userInforService.confirmInfo(this.socket, data));
    this.socket.on('disconnect', this.handleDisconnect);
  }
  handleDisconnect() {
    console.log('User disconnected');
  }
}

module.exports = (socket) => new SocketController(socket);