const _ = require('lodash');
const SocketServer = require('socket.io');
const { authenticate } = require('./authentication');
const { ROLES_NAMES } = require('../config/auth/roles');
const { pUserBasicData } = require('../helpers/projections');
const socketClient = require('./company');

class Server {
    constructor() {
        this.options = {
            pingTimeout: 5000,
            pingInterval: 2000,
            path: '/io',
        };

        this.io = null;
        this.connected = 0;
        this.clients = [];
        this.rooms = {};
        this.subscribers = [];
    }

    initialize(httpServer) {
        this.io = new SocketServer(httpServer, this.options);
        this.io.use(authenticate);
        this.io.on('connection', this.onClientConnected.bind(this));
        global.io = this.io;
        socketClient.start();
    }


    async onClientConnected(socket) {
        const self = this;
        // Increment Count
        this.connected += 1;
        // self.joinRooms(socket);
        socket.on('subscribe', function (data) {
            if (!_.isNil(data) && data.room) {
                self.joinRoom(this, data.room);
            }
        });
        socket.on('unsubscribe', function (data) {
            if (!_.isNil(data) && data.room) {
                self.leaveRoom(this, data.room);
            }
        });

        socket.on('data', function (data) {
            if (!_.isNil(data) && data.room) {
                this.io.to(data.room).emit({
                    user: pUserBasicData(socket.request.user),
                    data: data.data,
                    room: data.room
                });
            }
        });

        socket.on('disconnect', () => self.onClientDisconnected(socket));
        this.clients.push(socket);

    }

    joinRoom(socket, room) {
        const { user } = socket.request;
        if (_.isNil(user.roles) || user.roles.length === 0) {
            return;
        }

        if (this.rooms[room]) {
            this.rooms[room] += 1;
        } else {
            this.rooms[room] = 1;
        }
        this.subscribers.push({
            id: user._id.toString(),
            room
        });
        socket.join(room);
    }

    leaveRoom(socket, room) {
        const { user } = socket.request;
        if (_.isNil(user.roles) || user.roles.length === 0) {
            return;
        }
        const sExists = _.findIndex(this.subscribers, { id: user._id.toString(), room });
        if (sExists === -1) {
            return;
        }

        // join rooms related to all user roles
        if (this.rooms[room] > 0) {
            this.rooms[room] -= 1;
        }


        socket.leave(room);

    }

    leaveRooms(socket) {
        const { user } = socket.request;
        console.log(user);
        if (_.isNil(user.roles) || user.roles.length === 0) {
            return;
        }

        // join rooms related to all user roles
        for (let i = 0; i < this.subscribers.length; i++) {
            if (this.subscribers[i].id === user._id.toString()) {
                this.leaveRoom(socket, this.subscribers[i].room);
            }
        }
    }

    async onClientDisconnected(socket) {
        const sExists = this.clients.indexOf(socket);
        if (sExists === -1) {
            return;
        }
        this.leaveRooms(socket);


        this.clients.splice(sExists, 1);
    }

    get socket() {
        return this.io;
    }
}

module.exports = new Server();
