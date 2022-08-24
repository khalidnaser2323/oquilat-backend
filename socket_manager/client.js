const SocketIO = require('socket.io-client');

class SocketClient {
    constructor() {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTk1YWZkOTg4Y2M5YTc1NzE5NjRkNmQiLCJtb2JpbGUiOiIrMjAxOTk4OTg5ODk4Iiwicm9sZXMiOlsiY3VzdG9tZXIiXSwiaWF0IjoxNTg2ODY4MTg1fQ.FJP5_5v3HQrruNqqD279Fk6veB1OmCYLNasSKjjfVbs";
        this.uri = `http://localhost:3000?authorization=${token}`;
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
        const conversation = "5e95afd988cc9a7571964d6d";
        this.io.emit('subscribe', { room: conversation });
        setTimeout(() => this.io.emit())
    }

}

new SocketClient().start();
