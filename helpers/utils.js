const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const {parsePhoneNumberFromString} = require("libphonenumber-js");
const {
    ValidationError,
} = require('../helpers/errors/index');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

class Utils {
    static inDevelopment() {
        const env = process.env.NODE_ENV || 'development';
        return (env === 'development');
    }

    static getPath(base, file){
        return path.join(base, file);
    }

    static dirWalk(dir) {
        let results = [];
        const list = fs.readdirSync(dir);

        list.forEach((file) => {
            const fPath = `${dir}/${file}`;
            const stat = fs.statSync(fPath);

            if (stat && stat.isDirectory()) {
                results = results.concat(Utils.dirWalk(fPath));
            } else {
                results.push(fPath);
            }
        });

        return results;
    }

    static getDayString(timestamp) {
        const date = new Date(timestamp);
        const dayName = days[date.getDay()];

        return dayName.toLowerCase();
    }

    static parseBoolean(text) {
        if (_.isNil(text) || text.length === 0) {
            return false;
        }

        return (text.toLowerCase() === 'true');
    }

    static mapArrayToJsonByKey(array = [], key = undefined) {
        if (!array && !Array.isArray(array) && !key) {
            throw new Error('array and id are required');
        }
        const jsonObj = array.reduce((itemsObj, item) => {
            const nItemsObject = itemsObj;
            nItemsObject[item[key]] = item;
            return nItemsObject;
        }, {});
        return jsonObj;
    }

    static toObjectId(id){
        return mongoose.Types.ObjectId(id);
    }
    static async parseMobileNumber(mobile) {
        let newMobile = mobile;
        newMobile = await this.convertMobileNumberToEnglish(newMobile);
        if (!String(newMobile).startsWith('966') && !String(newMobile).startsWith('00966')) {
            if (!String(newMobile).startsWith('+')) newMobile = '+966' + newMobile
        }
        newMobile = newMobile.replace('00966', '+966')
        if (String(newMobile).startsWith('966')) newMobile = '+' + newMobile;
        if (newMobile) {
            const phoneNumber = parsePhoneNumberFromString(newMobile);
            if (!phoneNumber)
                throw new ValidationError(0, `this phone number is invalid`);
            else {
                if (!phoneNumber.isValid())
                    throw new ValidationError(0, `this phone number is invalid`);
            }
        }
        newMobile =newMobile.replace('+9660', '+966');
        return newMobile;

    }

    static convertMobileNumberToEnglish(mobileNumber) {
        let persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
        let arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
        for (let i = 0; i < 10; i++) {
            mobileNumber = mobileNumber.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
        }
        return mobileNumber;


    }

}

module.exports = Utils;
