const SocketIO = require('socket.io-client');

class SocketClient {
    constructor() {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MThhYzAwOTUzNDZlNzNjMzQ2MzAxNmMiLCJtb2JpbGUiOiI1NjY1NjIyMTI5MTAiLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE2MzY0ODMwODF9.Fk6CevuE0gpH1u8FTFwh6QlJB7ISEKzZU3PqCnFcrsI";
        this.uri = `https://oq-bot-backend.abgari.store?authorization=${token}`;
        this.options = {
            pingTimeout: 5000,
            pingInterval: 2000,
            path: '/io',
        };
        this.io = null;

    }

    start() {
        this.io = new SocketIO(this.uri, this.options);
        this.io.on('connect', function (socket) {
            console.log('connect');
        });

        this.io.on('error', (err) => {
            console.log('error');
            console.log(err);
        });

        this.io.on('data', (data) => {
            console.log('data');
            console.log(data);
        });

        this.io.on('disconnect', (err) => {
            console.log('disconnected');
            console.log(err);
        });
        const conversation = "61e6c169a2dcad71b82f937a";
        setTimeout(() => this.io.emit('subscribe', { room: conversation }), 5000);
        setTimeout(() => this.io.emit())
    }

}

module.exports = new SocketClient();

// new SocketClient().start();
