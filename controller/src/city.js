const RESOURCE_NAMES = require('../../config/auth/resource_names');
const express = require('express');
const router = express.Router();
const CityService = require('../../services/core/CityService');
const {countrySchema, idSchema, areaSchema} = require('../../validations/validation');
const BaseController = require('../BaseController');
router.post('/', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.CITY, ['createAny']);
        const data = req.body;
        await req.validate(countrySchema, data);
        const response = await CityService.create(data);
        res.send(response);
    } catch (err) {
        next(err);
    }
});
router.get('/', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.CITY, ['readAny']);
        const filters = req.query;
        const params = req.query;
        const response = await CityService.getCities(filters, params);

        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.CITY, ['readAny']);
        const data = {id: req.params.id};
        await req.validate(idSchema, data);
        const response = await CityService.getOne(data.id);
        res.send(response);
    } catch (err) {
        next(err);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.CITY, ['updateAny']);
        const data = req.body;
        await req.validate(countrySchema, data, false);
        await req.validate(idSchema, {id: req.params.id});
        const response = await CityService.update(req.params.id, data);
        res.send(response);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await req.authorize(req.user, RESOURCE_NAMES.CITY, ['deleteAny']);
        await req.validate(idSchema, {id: req.params.id});
        const response = await CityService.delete(req.params.id);
        res.send(response);

    } catch (err) {
        next(err);
    }
});
module.exports = new BaseController('/cities', 'private', router);
//Done Documentation
