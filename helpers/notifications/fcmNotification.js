const config = require('../../config');
const BaseNotification = require('./BaseNotification');
const FCM = require('fcm-node');
const fcm = new FCM(config.fcm.serverKey);
const {User} = require('../../db/models');

class fcmNotification extends BaseNotification {
    async send(notificationObj) {
        const user = await User.getById(notificationObj.notified);
        if (!user.fcm_token) {
            return;
        }
        let title = notificationObj.title;
        let body = notificationObj.message;
        const data = {
            notification: {
                title: title,
                body: body
            },
            to: user.fcm_token,
            data: notificationObj.data
        };
        fcm.send(data, (err, response) => {
            if (err) {
                console.log(err);
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });

    }

}

module.exports = new fcmNotification();
