
const amqp = require('amqplib/callback_api');
const connect_url='amqp://pmtfvioo:kF2xJs...@skunk.rmq.cloudamqp.com/pmtfvioo';
amqp.connect(connect_url, function (err, conn) {
    conn.createChannel(function (err, ch) {
        ch.consume('test-queue', function (msg) {
                console.log('.....');
                setTimeout(function(){
                    console.log('hiiii iam posting product !');
                    console.log("Message:", msg.content.toString());
                },4000);
            },{ noAck: true }
        );
    });
});
