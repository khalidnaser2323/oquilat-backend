const BaseNotificationProcessor = require('./BaseNotificationProcessor');
const {NOTIFICATION_TYPES} = require('../../config/constants/notification');

class EmployeeVerifiedNotificationProcessor extends BaseNotificationProcessor {
    async create(data) {
        try {
            const UserService = require('../core/UserService');
            const user = await UserService.getUser(data.id);
            const nData = {};
            nData.title = `Account Verified`;
            nData.message = `Hello, we are exciting to work with you`;
            nData.translation = {
                ar: {
                    title: `لقد تم تفعيل الحساب`,
                    message: `مرحباً, نحن متحمسون للعمل معك`
                }
            };
            nData.notified = user._id;
            nData.type = NOTIFICATION_TYPES.EMPLOYEE_VERIFICATION;
        } catch (err) {
            console.log(err);
        }
    }

}

module.exports = new EmployeeVerifiedNotificationProcessor();