const _ = require('lodash');
const {SUPPORTED_LANGUAGES} = require('../../config/constants');
module.exports = async (req, res, next) => {
    const content_language = req.headers['content-language'];
    if (SUPPORTED_LANGUAGES.includes(content_language)) {
        req.language = content_language;
    } else {
        req.language = "en";
    }
    let temp = res.send;
    if (content_language === 'all') {
        next();
    } else {
        res.send = function (data, language = req.language) {
            if (data) {
                data = toLanguage(JSON.parse(JSON.stringify(data)), language);
            }
            temp.call(this, data);
        };
        next();
    }
};
let toLanguage = (data, language) => {
    if (_.isNil(data)) {
        return;
    }
    if (!_.isObject(data)) {
        return data;
    }
    if (data.translation && data.translation[language]) {
        const translationKeys = Object.keys(data.translation[language]);
        for (let j = 0; j < translationKeys.length; j++) {
            data[translationKeys[j]] = data.translation[language][translationKeys[j]];
        }
    }
    delete data.translation;
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        data[keys[i]] = toLanguage(data[keys[i]], language);
    }
    return data;
};
