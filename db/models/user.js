const mongoose = require('mongoose');
const {
    Schema
} = mongoose;
const crypto = require('../../helpers/crypto');
const {
    ROLE_NAMES_ENUM,
    ROLES_NAMES
} = require('../../config/auth/roles');
const {
    LANGUAGES_ENUM,
    LANGUAGES
} = require('../../config/constants/languages');
const {
    TYPE
} = require('../../config/constants/common');

const addressSchema = new Schema({
    name: {
        type: String
    },
    area: {
        type: Schema.Types.ObjectId,
        ref: "Area"
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: "City"
    },
    address: {
        type: String,
        trim: true
    },
    special_mark: {
        type: String,
        trim: true
    },
    mobile: {
        type: String
    },
    default: {
        type: Boolean,
        default: false
    }
});

const conversationsSchema = new Schema({
    message: {
        type: String
    },
    type: {
        type: String,
        enum: TYPE
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    isArchived: {
        type: Boolean,
        default: false
    }
});
const userSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    profile_image: {
        type: String
    },
    email: {
        type: String
    },
    roles: {
        type: Array,
        default: ['customer'],
        required: true
    },
    token: {
        type: String,
        trim: true
    },
    verify_mobile: {
        token: {
            type: String,
            trim: true
        },
        token_time: {
            type: Date
        },
        token_expiration: {
            type: Date
        }
    },
    country_code: {
        type: String
    },
    current_status: {
        type: String
    },
    flow_status: {
        type: String
    },
    current_order: {
        type: Schema.Types.Mixed
    },
    suggested_orders: {
        type: Schema.Types.Mixed
    },
    language: {
        type: String,
        enum: LANGUAGES_ENUM,
        default: LANGUAGES.EN
    },
    fcm_token: {
        type: String
    },
    search_inputs: [{
        type: String
    }],
    is_verified: {
        type: Boolean,
        default: false
    },
    subscribed: {
        type: Boolean,
        default: false
    },
    addresses: [addressSchema],
    password: {
        type: String
    },
    identification_number: {
        type: String
    },
    mobile: {
        type: String,
        trim: true
    },
    location: {
        type: String
    },
    region: {
        type: String
    },
    address: {
        type: String
    },
    identity_scan: {
        type: String
    },
    notes: {
        type: String
    },
    conversations: [conversationsSchema],
    chat_status: {
        type: String
    }
});


userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        console.log('his.password', this.password)
        this.password = crypto.createHash(this.password);
        console.log('this.password', this.password)
    }
    if (this.isModified('mobile') ||
        this.isModified('roles')) {
        this.token = this.generateToken();
    }

    next();
});


userSchema.methods.generateToken = function () {
    const token = crypto.generateJwtToken({
        sub: this._id,
        mobile: this.mobile,
        roles: this.roles,
    });
    return token;
};
userSchema.methods.generateSmsToken = function () {
    return crypto.generateRandomNumber();
};

userSchema.index({
    name: 1
});
userSchema.index({
    '$**': 'text'
});
module.exports = mongoose.model('User', userSchema).createIndexes();