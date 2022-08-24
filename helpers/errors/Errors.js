const ErrorCodes = require('./errorCodes');

/**
 * id: Number (Error unique id)
 * name: String (Error name)
 * status: Number (http response status)
 * message: String (Error message)
 */
class BaseError extends Error {
    constructor(
        code = 0,
        name = 'Error',
        status = 500,
        message = 'Internal server error',
        message_ar = "خطأ فى الوصول"
    ) {
        super(message, message_ar);

        this.code = code;
        this.name = name;
        this.status = status;
        this.message = message;
        this.message_ar = message_ar;
    }

    toJson() {
        return {
            error: this.name,
            message: this.message,
        };
    }
}

// Authentication & Authorization
class NotFoundError extends BaseError {
    constructor(code = 0, message = 'Error 404', message_ar = 'غير موجود') {
        super(code, 'NotFoundError', 404, message, message_ar);
    }
}

class UnauthenticatedError extends BaseError {
    constructor(code = 0, message = 'Authentication failed') {
        super(code, 'UnauthenticatedError', 403, message);
    }
}

class UnauthorizedError extends BaseError {
    constructor(code = 0, message = 'Unauthorized Access') {
        super(code, 'UnauthorizedError', 401, message);
    }
}

class ValidationError extends BaseError {
    constructor(code = 0, message = 'Bad Request', errors) {
        super(code, 'ValidationError', 400, message);
        this.errors = errors;
    }
}

class UnexpectedError extends BaseError {
    constructor(code = 0, message = 'Internal Server Error 500') {
        super(code, 'UnexpectedError', 500, message);
    }
}

class PaymentError extends BaseError {
    constructor(code = 0, message = 'Payment Error', errors) {
        super(code, 'PaymentError', 400, message);
        this.errors = errors;
    }
}

class BusinessError extends BaseError {
    constructor(code = 0, message = 'Business error', errors) {
        super(code, message, errors);
    }
}

module.exports = {
    Error: BaseError,
    UnauthenticatedError,
    UnauthorizedError,
    ValidationError,
    UnexpectedError,
    NotFoundError,
    ErrorCodes,
    PaymentError,
    BusinessError,
};
