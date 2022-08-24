const NOTIFICATION_TYPES_ENUM = ['sms_verification','new_message','new_rate'];

module.exports = {
    NOTIFICATION_TYPES_ENUM,
    NOTIFICATION_TYPES: {
        SMS_VERIFICATION: NOTIFICATION_TYPES_ENUM[0],
        NEW_MESSAGE: NOTIFICATION_TYPES_ENUM[1],
        NEW_RATE: NOTIFICATION_TYPES_ENUM[2],
    },
}
;
