const _ = require("lodash");
const BaseService = require("../BaseService");
const amqp = require('amqplib/callback_api');

class QueueService extends BaseService {

    async publishToQueue(queueName, data) {
        try {
            let ch = null;
            // const connect_url = 'amqp://pmtfvioo:kF2xJs...@skunk.rmq.cloudamqp.com/pmtfvioo';
            const connect_url = 'amqp://farhat437:farhat437@localhost:5672/dev';
            ch = await amqp.connect(connect_url, function (err, conn) {
                if (err) {
                    console.log('connect err', err);

                } else {
                    console.log('Connected successfully');
                }
                conn.createChannel(function (err, channel) {
                    console.log('errrrr create channel', err);
                    return channel
                });
            });
            ch.sendToQueue(queueName, new Buffer(data));
            // process.on('exit', (code) => {
            //     ch.close();
            //     console.log(`Closing rabbitmq channel`);
            // });

        } catch (e) {
            throw e
            console.log('errrrr', e);
        }
    }
}

module.exports = new QueueService();
// const amqp= require('amqplib/callback_api') ;
// const CONN_URL = 'amqp://pmtfvioo:kF2xJs...@skunk.rmq.cloudamqp.com/pmtfvioo';
// let ch = null;
// amqp.connect(CONN_URL, function (err, conn) {
//     conn.createChannel(function (err, channel) {
//         ch = channel;
//     });
// });
// const publishToQueue = async (queueName, data) => {
//     await ch.sendToQueue(queueName, new Buffer(data));
// };
// module.exports= publishToQueue();
// process.on('exit', (code) => {
//     ch.close();
//     console.log(`Closing rabbitmq channel`);
// });
