const express = require('express');
const router = express.Router();
const RESOURCE_NAMES = require('../../config/auth/resource_names');
const bundleservice = require('../../services/core/bundles');
const { bundlesSchema, idSchema} = require('../../validations/validation');
const BaseController = require('../BaseController');

router.post('/', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.BUNDLES, ['createAny']);
    const data = req.body;
    const response = await bundleservice.create(data);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.BUNDLES, ['readAny']);
    const filters = req.query;
    const params = req.query;
    const response = await bundleservice.getBundles(filters, params);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.BUNDLES, ['readAny']);
    const data = {
      id: req.params.id
    };
    await req.validate(idSchema, data);
    const response = await bundleservice.getOne(data.id);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.BUNDLES, ['updateAny']);
    const data = req.body;
    await req.validate(idSchema, {
      id: req.params.id
    });
    const response = await bundleservice.update(req.params.id, data);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.BUNDLES, ['deleteAny']);
    await req.validate(idSchema, {
      id: req.params.id
    });
    const response = await bundleservice.delete(req.params.id);
    res.send(response);

  } catch (err) {
    next(err);
  }
});
module.exports = new BaseController('/bundles', 'private', router);