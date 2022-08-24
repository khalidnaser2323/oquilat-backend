class BaseNotificationProcessor {
    async create(data) {
        throw new Error(`You should implement this `);
    }

}

module.exports = BaseNotificationProcessor;
