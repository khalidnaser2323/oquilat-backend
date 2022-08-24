const _ = require('lodash');

class Projection {
    constructor(fields) {
        this.fields = fields;
    }

    append(fields) {
        this.fields += ` ${fields}`;
        return new Projection(this.fields);
    }

    pickFrom(obj) {
        if (_.isNil(obj)) {
            return obj;
        }

        return _.pick(obj, this.toArray());
    }

    pickFromArray(arr) {
        if (arr.length === 0) {
            return arr;
        }
        const nArr = [];
        for (let i = 0; i < arr.length; i++) {
            nArr.push(this.pickFrom(arr[i]));
        }
        return nArr;
    }

    toString() {
        return this.fields;
    }

    toArray() {
        if (!this.fields) {
            return this.fields;
        }
        return this.fields.split(/\s/);
    }
}

module.exports = Projection;
