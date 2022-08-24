const _ = require('lodash');
const path = require('path');
const BaseController = require('../BaseController');
const express = require('express');
const router = express.Router();
const utils = require('../../helpers/utils');
const config = require('../../config/index');
const {
    User,
    Search
} = require("../../db/models/index");
const crypto = require('../../helpers/crypto');


const {
    LANGUAGES_ENUM
} = require('../../config/constants/languages');
const {
    loginSchema,
    loginMobileSchema,
    verifySchema
} = require('../../validations/validation');
const userService = require('../../services/core/UserService');
const {
    pUserLogin,
    pLoginWithBrand
} = require('../../helpers/projections');


router.get('/', async (req, res, next) => {
    return res.send(config.app);
});

router.post('/login/mobile', async (req, res, next) => {
    try {
        const data = req.body;
        await req.validate(loginMobileSchema, data);
        data.mobile = await utils.parseMobileNumber(data.mobile);
        let user;
        user = await userService.loginWithMobile(data.mobile, data.type, data);
        const response = {
            id: user._id,
            token: user.token
        };
        if (utils.inDevelopment()) {
            response.mobile_token = user.verify_mobile.token;
        }
        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const {
            name,
            password
        } = req.body;
        let user = await User.getOne({
            $or: [{
                "name": name
            }]
        });
        if (!user) {
            return res.status(400).send('Invalid Name or Password.')
        }
        const isMatch = crypto.compareHash(password, user.password)
        if (!isMatch) return res.status(400).send('invalid Name and password!')

        const response = {
            id: user._id,
            token: user.token
        };
        if (utils.inDevelopment()) {
            response.mobile_token = user.verify_mobile.token;
        }
        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.post('/verify', async (req, res, next) => {
    try {
        const data = req.body;
        await req.validate(verifySchema, data);
        let user;
        user = pUserLogin.pickFrom(await userService.verify(data.user, data.mobile_token));
        res.send(user);
    } catch (err) {
        next(err);
    }
});


if (utils.inDevelopment()) {
    router.get('/docs', async (req, res, next) => {
        try {
            const view = path.join(__dirname, '../../docs/swagger-ui/index.html');
            return res.sendFile(view);
        } catch (err) {
            return next(err);
        }
    });
}
router.get('/logs/combined', async (req, res, next) => {
    try {
        const view = path.join(__dirname, '../logs/combined.log');
        return res.sendFile(view);
    } catch (err) {
        return next(err);
    }
});
router.get('/logs/errors', async (req, res, next) => {
    try {
        const view = path.join(__dirname, '../logs/error.log');
        return res.sendFile(view);
    } catch (err) {
        return next(err);
    }
});
router.get('/logs/exceptions', async (req, res, next) => {
    try {
        const view = path.join(__dirname, '../logs/exceptions.log');
        return res.sendFile(view);
    } catch (err) {
        return next(err);
    }
});
module.exports = new BaseController('/', 'public', router);