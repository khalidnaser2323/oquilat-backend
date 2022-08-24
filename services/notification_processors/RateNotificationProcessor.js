const BaseNotificationProcessor = require('./BaseNotificationProcessor');
const {NOTIFICATION_TYPES} = require('../../config/constants/notification');
const {Branch, User} = require('../../db/models/index');
const {pCompanyOrUserData} = require('../../helpers/projections');

class RateNotificationProcessor extends BaseNotificationProcessor {

    async create(data) {
        const UserService = require('../core/UserService');
        try {
            const nData = {};
            const rater = await UserService.getUser(data.rater);
            const rated = await UserService.getUser(data.rated);
            let raterName;
            if (rater.roles.includes('company')) {
                raterName = rater.company_name;
            } else {
                raterName = rater.name;
            }
            nData.notified = data.rated;
            nData.message = `New Rate`;
            nData.title = `${raterName} rated you ${data.rate} stars  `;
            nData.translate = {
                ar: {
                    title: `${raterName} قام بتقييمك  ${data.rate}`,
                    message: `${rater.name}`
                }
            };
            nData.data = {
                rater: pCompanyOrUserData.pickFrom(rater)
            };
            nData.type = NOTIFICATION_TYPES.NEW_RATE;
        } catch (err) {
            console.log(err);
        }
    }


}

module.exports = new RateNotificationProcessor();
