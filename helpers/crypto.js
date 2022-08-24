const bcrypt = require('bcrypt-nodejs');
const uniqid = require('uniqid');
const jwt = require('jsonwebtoken');

const config = require('../config');

class Utils {
    static createHash(text) {
        const salt = bcrypt.genSaltSync(5);
        return bcrypt.hashSync(text, salt);
    }

    static compareHash(text, hash) {
        return bcrypt.compareSync(text, hash);
    }

    static generateJwtToken(data) {
        const token = jwt.sign(data, config.auth.local.key);
        return token;
    }

    static generateUniqueId() {
        return uniqid();
    }

    static generateRandomNumber() {
        const number = Math.floor(Math.random() * 9000) + 1000;
        return number;
    }

    static generateJWTBasedOnTime(signObj, timeoutMs) {
        const expiry = new Date();
        const timeoutSeconds = parseInt(timeoutMs / 1000);
        signObj.exp = parseInt(expiry.getTime() / 1000) + timeoutSeconds;
        let token = jwt.sign(signObj, config.auth.local.key);
        return token;
    }

    static async decodeJWT(token) {
        if (token) {
            return await this.verifyToken(token);
        }
    }

    static verifyToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, config.auth.local.key, function (err, decoded) {
                if (!err) {
                    return resolve(decoded);
                }
                if (err.name === 'TokenExpiredError') {
                    err.message = 'Token has been expired...';
                } else if (err.name === 'JsonWebTokenError') {
                    err.message = 'Invalid Token....';
                }
                return reject(err);
            });
        });
    }

    static generateOrderNumber(number) {
        const numberAsString = `${number}`;
        const numberLength = numberAsString.length;
        const numberPart1Length = Math.ceil(numberLength / 2);
        const numberPart2Length = numberPart1Length > 1 ? numberLength - numberPart1Length : 0;
        const numberPart1String = numberAsString.substring(0, numberPart1Length);
        const numberPart2String = numberAsString.substring(numberPart2Length + 1);
        const firstChar = this.generateRandomString(1);
        const secondChar = this.generateRandomString(1);
        return `${firstChar}${numberPart1String}${secondChar}${numberPart2String}`;
    }

    static generateRandomString(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}

module.exports = Utils;
