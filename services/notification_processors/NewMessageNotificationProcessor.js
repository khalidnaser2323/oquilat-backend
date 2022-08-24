const BaseNotificationProcessor = require('./BaseNotificationProcessor');
const {NOTIFICATION_TYPES} = require('../../config/constants/notification');
const {Company, User, Conversation} = require('../../db/models/index');

class NewMessageNotificationProcessor extends BaseNotificationProcessor {

    async create(data) {
        try {
            const testData = {
                _id:data._id,
                message:data.message,
                author:data.author,
                conversation:data.conversation,
            };
            const nData = {};
            const sender = await User.getById(data.author._id.toString());
            const conversation = await Conversation.getById(data.conversation);
            const company = await User.getById(conversation.company);
            testData.job = conversation.job;
            if (sender.roles.includes('customer')) {
                nData.notified = conversation.company;
                nData.message = data.message;
                nData.title = `${sender.name} sent you a message`;
                nData.translate = {
                    ar: {
                        title: `${sender.name} قام بارسال رسالة `,
                        message: data.message
                    }
                };
                nData.type = NOTIFICATION_TYPES.NEW_MESSAGE;
                nData.data = {
                    message: testData,
                    sender: {
                        name: sender.name,
                        profile_image: sender.profile_image
                    }
                };

            } else {
                nData.title = `${sender.company_name} sent you a message`;
                nData.translate = {
                    ar: {
                        title: `${company.company_name} قام بارسال رسالة `,
                        message: data.message
                    }
                };
                nData.notified = conversation.user;
                nData.type = NOTIFICATION_TYPES.NEW_MESSAGE;
                nData.message = data.message;
                nData.data = {
                    message: testData,
                    sender: {
                        name: company.company_name,
                        profile_image: company.logo
                    },

                };
            }

        } catch (err) {
            console.log(err);
        }
    }


}

module.exports = new NewMessageNotificationProcessor();
