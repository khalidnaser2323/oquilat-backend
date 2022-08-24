const multerMW = require('./multer');
const multipartParser = require('./multipartParser');
const authentication = require('./authentication');
const language = require('./language');
const hooks = require('./hooks');
module.exports = {
    multerMW,
    multipartParser,
    language,
    authentication,
    hooks,
};
