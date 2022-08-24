const mobilyWs = require('mobily-ws');
const config = require('../../config');
const BaseNotification = require('./BaseNotification');
const client = mobilyWs(config.mobilyWs.apiKey, config.mobilyWs.name);

class Sms extends BaseNotification {
    async send(config) {
        console.log(config);
        return new Promise((resolve, reject) => client.sendSMS(config.body, [config.to]).then((response) => console.log(response)));
    }
}

module.exports = new Sms();
