const _ = require('lodash');
const errors = require('../helpers/errors');
const utils = require('../helpers/utils');
const storage = require('../helpers/storage');
class BaseService {
    constructor() {
        // Errors
        this.UnauthenticatedError = errors.UnauthenticatedError;
        this.UnauthorizedError = errors.UnauthorizedError;
        this.ValidationError = errors.ValidationError;
        this.NotFoundError = errors.NotFoundError;
        this.BusinessError = errors.BusinessError;
        this.utils = utils;
        this.storage = storage;
    }

    saveFile(file) {

    }

    validateExistence(object, message) {
        if (_.isNil(object)) {
            throw new this.NotFoundError(0, message);
        }
    }
}

module.exports = BaseService;
