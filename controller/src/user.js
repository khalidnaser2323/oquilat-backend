const _ = require('lodash');
const path = require('path');
const RESOURCE_NAMES = require('../../config/auth/resource_names');
const express = require('express');
const router = express.Router({
    mergeParams: true
});
const utils = require('../../helpers/utils');
const userService = require('../../services/core/UserService');
// const OrderService = require('../../services/core/OrderService');
const complaintService = require('../../services/core/ComplaintService');

const {
    loginSchema,
    idSchema,
    emailSchema,
    updateProfileSchema,
    addressSchema,
    messageSchema
} = require('../../validations/validation');
const {
    pUserLogin,
    pUserBasicData
} = require('../../helpers/projections');
const crypto = require('../../helpers/crypto');

const {
    ALLOWED_FILE_TYPES,
    DOC_UPLOAD_DEFAULT_EXTENSIONS
} = require('../../config/constants/common');
const BaseController = require('../BaseController');

const {
    multerMW,
    multipartParser,
} = require('../middlewares/index');
const upload = multerMW({
    size: 2 * 1024 * 1024,
    fields: [{
        name: 'identity_scan',
        count: 1,
        ext: ALLOWED_FILE_TYPES.IMAGES
    },]
});

router.post('/create', upload, multipartParser, async (req, res, next) => {
    try {
        const data = req.body;
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['createAny']);
        await req.validate(loginSchema, data);
        const response = await userService.create(data, req.files);
        res.send({
            id: response._id
        });
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['readAny']);
        const filters = req.query;
        const params = req.query;
        if (req.query.role) {
            filters.role = req.query.role.split(',');
        }
        const response = await userService.getUsers(filters, params);
        response.users = pUserBasicData.pickFromArray(response.users);
        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.get('/conversations/list', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['readAny']);
        const filters = req.query;
        const params = req.query;
        if (req.query.role) {
            filters.role = req.query.role.split(',');
        }
        const response = await userService.getUsersConverstions(filters, params);
        response.users = pUserBasicData.pickFromArray(response.users);
        res.send(response);
    } catch (err) {
        next(err);
    }
});


router.get('/subscribedCount', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['readAny']);
        const response = await userService.getSubscribedClientsCount(req.user);
        res.send({
            count: response
        });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['readAny', 'readOwn'], async () => req.user_id === req.params.id);
        await req.validate(idSchema, {
            id: req.params.id
        });
        const response = await userService.getUser(req.params.id);
        res.send(pUserBasicData.pickFrom(response));
    } catch (err) {
        next(err);
    }
});
router.get('/:id/conversation', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['readAny', 'readOwn'], async () => req.user_id === req.params.id);
        await req.validate(idSchema, {
            id: req.params.id
        });
        const response = await userService.getOneUserConversations(req.params.id);
        res.send(pUserBasicData.pickFrom(response));
    } catch (err) {
        next(err);
    }
});


router.put('/:id', upload, multipartParser, async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['updateAny', 'updateOwn'], async () => req.user_id === req.params.id);
        const data = req.body;
        const id = req.params.id;
        await req.validate(updateProfileSchema, data, false);
        if (data.mobile) {
            data.mobile = await utils.parseMobileNumber(data.mobile);
        }
        if (data.password) {
            data.password = crypto.createHash(data.password);
        }
        let response = await userService.updateUser(id, data, req.files);
        if (response.is_verified === false) {
            if (utils.inDevelopment()) {
                response = {
                    id: response._id,
                    mobile_token: response.verify_mobile.token
                }
            } else {
                response = {
                    id: response._id
                };
            }
        }
        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.put('/:id/conversations', upload, multipartParser, async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['updateAny', 'updateOwn'], async () => req.user_id === req.params.id);
        const data = req.body;
        const id = req.params.id;
        await req.validate(updateProfileSchema, data, false);
        let response = await userService.updateConverrsation(id, data, req.files);
        res.send(response);
    } catch (err) {
        next(err);
    }
});
router.get('/chatStatus/:mobile', async (req, res, next) => {
    try {
        const mobile = req.params.mobile;
        let response = await userService.getChatStatus(mobile);
        res.send(response);
    } catch (err) {
        next(err);
    }
});
router.put('/:id/updateChatStatus', async (req, res, next) => {
    try {
        const data = req.body;
        const id = req.params.id;
        await req.validate(updateProfileSchema, data, false);
        let response = await userService.updateChatStatus(id, data);
        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.post('/:id/sendWhatsAppMessage', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['readAny']);
        const data = req.body;
        const id = req.params.id;
        await req.validate(messageSchema, data);
        const response = await userService.sendWhatsMessage(id, data);
        res.send(response);
    } catch (err) {
        next(err);
    }
});
router.post('/sendEmail', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['readAny']);
        const data = req.body;
        await req.validate(emailSchema, data);
        const response = await userService.sendEmail(req.user, data);
        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['deleteAny']);
        const response = await userService.delete(req.params.id, req.user_id);
        res.send(response);
    } catch (err) {
        next(err);
    }
});
router.post('/:userId/addresses', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['updateOwn'], async () => req.user_id === req.params.userId);
        const data = req.body;
        await req.validate(addressSchema, data);
        data.mobile = await utils.parseMobileNumber(data.mobile);
        const response = await userService.addAddress(data, req.params.userId);
        res.send(response);
    } catch (err) {
        next(err);
    }
});
router.put('/:userId/addresses/:addressId', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['updateOwn'], async () => req.user_id === req.params.userId);
        const data = req.body;
        await req.validate(addressSchema, data, false);
        if (data.mobile) {
            data.mobile = await utils.parseMobileNumber(data.mobile);
        }
        const response = await userService.updateAddress(data, req.params.userId, req.params.addressId);
        res.send(response);
    } catch (err) {
        next(err);
    }
});
router.delete('/:userId/addresses/:addressId', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['deleteOwn'], async () => req.user_id === req.params.userId);
        const response = await userService.deleteAddress(req.params.userId, req.params.addressId);
        res.send(response);
    } catch (err) {
        next(err);
    }
});
// will replace order with subscription @Youssef
// router.get('/:userId/orders', async function (req, res, next) {
//     try {
//         await req.authorize(req.user, RESOURCE_NAMES.ORDER, ['readOwn'], async () => req.user_id === req.params.userId);
//         const filters = req.query;
//         const params = req.query;
//         const userId = req.params.userId;
//         // const result = await OrderService.getUserOrders(userId, filters, params);
//         res.send(result);
//     } catch (e) {
//         next(e);
//     }
// });
router.get('/:userId/complaints', async function (req, res, next) {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['readOwn'], async () => req.user_id === req.params.userId);
        const params = req.query;
        const userId = req.params.userId;
        const result = await complaintService.getUserComplaints(userId, params);
        res.send(result);
    } catch (e) {
        next(e);
    }
});


router.get('/search/text', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.USER, ['readAny']);
        const params = req.query;
        const response = await userService.search(params);
        response.users = pUserBasicData.pickFromArray(response.users);
        res.send(response);
    } catch (err) {
        next(err);
    }
});

// router.get('/createUSers/json', async (req, res, next) => {
//     try {
//         const response = await userService.createUsersFromJson();
//         res.send(response);
//     } catch (err) {
//         next(err);
//     }
// });

module.exports = new BaseController('/users', 'private', router);