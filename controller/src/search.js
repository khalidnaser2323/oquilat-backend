const _ = require('lodash');
const path = require('path');
const express = require('express');
const router = express.Router();
const utils = require('../../helpers/utils');
const {searchSchema, idSchema} = require('../../validations/validation');
const {ALLOWED_FILE_TYPES} = require('../../config/constants/common');
RESOURCE_NAMES = require('../../config/auth/resource_names');
const SearchService = require('../../services/core/SearchService');
const BaseController = require('../BaseController');

router.post('/', async function (req, res, next) {
    try {
        const data = req.body;
        await req.validate(searchSchema, data);
        const result = await SearchService.create(data);
        res.send(result);
    } catch (e) {
        next(e);
    }
});

router.get('/:deviceId', async function (req, res, next) {
    try {
        const result = await SearchService.getSearchInputsByDeviceId(req.params.deviceId);
        res.send(result);
    } catch (e) {
        next(e);
    }
});
router.delete('/:deviceId', async function (req, res, next) {
    try {
        const result = await SearchService.deleteSearchInputsByDeviceId(req.params.deviceId);
        res.send(result);
    } catch (e) {
        next(e);
    }
});


module.exports = new BaseController('/search', 'public', router);
