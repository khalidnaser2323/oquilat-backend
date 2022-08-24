const BaseNotificationProcessor = require('./BaseNotificationProcessor');
const _ = require('lodash');
const config = require('../../config');
const { smsNotification } = require('../../helpers/notifications');
const { UnauthorizedError } = require('../../helpers/errors');

const smsDelay = 60 * 1000;
const expirationSms = 60 * 60 * 1000;

class LoginSmsNotificationProcessor extends BaseNotificationProcessor {
    async create(user) {
        try {
            const elapsedTime = Date.now() - (user.verify_mobile.token_time || 0);

            if (elapsedTime < smsDelay) {
                const waitTime = Math.round((smsDelay - elapsedTime) / 1000);
                throw new UnauthorizedError(0, `Frequent requests are not allowed, you need to wait ${waitTime} seconds`);
            }
            // const smsToken = user.generateSmsToken();
            const tokenTime = Date.now();
            const tokenExpiration = Date.now() + expirationSms;
            // if (user.mobile === "+966565666260" || user.mobile === "+966565665983" || user.mobile === "+201142100770") {
            //     user.verify_mobile.token = "7777";
            // } else {
            //     user.verify_mobile.token = smsToken;
            // }
            user.verify_mobile.token = "7777";
            user.verify_mobile.token_time = tokenTime;
            user.verify_mobile.token_expiration = tokenExpiration;
            await user.save();
            smsNotification.send({
                to: user.mobile,
                body: `Your ${config.app.name} verification code: ${user.verify_mobile.token}`
            });
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new LoginSmsNotificationProcessor();
