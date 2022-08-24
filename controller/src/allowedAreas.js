const _ = require('lodash');
const path = require('path');
const RESOURCE_NAMES = require('../../config/auth/resource_names');
const express = require('express');
const router = express.Router({
    mergeParams: true
});
const utils = require('../../helpers/utils');
const AllowedAreaService = require('../../services/core/AllowedAreaService');
const {
    idSchema,
    AllowedAreaSchema
} = require('../../validations/validation');
const BaseController = require('../BaseController');

router.post('/', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.ALLOWEDAREAS, ['createAny']);
        const data = req.body;
        await req.validate(AllowedAreaSchema, data);
        const response = await AllowedAreaService.create(data);
        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.ALLOWEDAREAS, ['readAny']);
        const filters = req.query;
        const params = req.query;
        const response = await AllowedAreaService.getAllowedAreas(filters, params);
        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.get('/check/coverage', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.ALLOWEDAREAS, ['readAny']);
        const params = req.query;
        const response = await AllowedAreaService.checkIfExistInOurPolygon(params);
        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.ALLOWEDAREAS, ['readAny']);
        const data = {
            id: req.params.id
        };
        await req.validate(idSchema, data);
        const response = await AllowedAreaService.getOne(data.id);
        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.ALLOWEDAREAS, ['updateAny']);
        const data = req.body;
        await req.validate(AllowedAreaSchema, data, false);
        await req.validate(idSchema, {
            id: req.params.id
        });
        const response = await AllowedAreaService.update(req.params.id, data);
        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.ALLOWEDAREAS, ['deleteAny']);
        await req.validate(idSchema, {
            id: req.params.id
        });
        const response = await AllowedAreaService.delete(req.params.id);
        res.send(response);

    } catch (err) {
        next(err);
    }
});
module.exports = new BaseController('/polygons', 'private', router);
//Done Documentation