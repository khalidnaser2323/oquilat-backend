const {NOTIFICATION_TYPES} = require('../../config/constants/notification');
const LoginSmsNotificationProcessor = require('./LoginSmsNotificationProcessor');
const NewMessageNotificationProcessor = require('./NewMessageNotificationProcessor');
const RateNotificationProcessor = require('./RateNotificationProcessor');

class NotificationLocator {

    getNotificationProcessor(Notification_Processor_Name) {
        switch (Notification_Processor_Name) {
            case NOTIFICATION_TYPES.SMS_VERIFICATION:
                return LoginSmsNotificationProcessor;
            case NOTIFICATION_TYPES.NEW_MESSAGE:
                return NewMessageNotificationProcessor;
            case NOTIFICATION_TYPES.NEW_RATE:
                return RateNotificationProcessor;


        }

    }

}

module.exports = new NotificationLocator();
