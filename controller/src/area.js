const _ = require('lodash');
const path = require('path');
const RESOURCE_NAMES = require('../../config/auth/resource_names');
const express = require('express');
const router = express.Router({mergeParams: true});
const utils = require('../../helpers/utils');
const AreaService = require('../../services/core/AreaService');
const {citySchema, idSchema, areaSchema} = require('../../validations/validation');
const BaseController = require('../BaseController');
router.post('/', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.AREA, ['createAny']);
        const data = req.body;
        data.city = req.params.cityId;
        await req.validate(citySchema, data);
        const response = await AreaService.create(data);
        res.send(response);
    } catch (err) {
        next(err);
    }
});
router.get('/', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.AREA, ['readAny']);
        const filters = req.query;
        const params = req.query;
        const response = await AreaService.getCities(req.params.cityId,filters, params);

        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.AREA, ['readAny']);
        const data = {id: req.params.id};
        await req.validate(idSchema, data);
        const response = await AreaService.getOne(data.id);
        res.send(response);
    } catch (err) {
        next(err);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.AREA, ['updateAny']);
        const data = req.body;
        await req.validate(citySchema, data, false);
        await req.validate(idSchema, {id: req.params.id});
        const response = await AreaService.update(req.params.id, data);
        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.AREA, ['deleteAny']);
        await req.validate(idSchema, {id: req.params.id});
        const response = await AreaService.delete(req.params.id);
        res.send(response);

    } catch (err) {
        next(err);
    }
});
module.exports = new BaseController('/cities/:cityId/areas', 'private', router);
//Done Documentation
