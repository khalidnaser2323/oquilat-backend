const _ = require('lodash');
const path = require('path');
const RESOURCE_NAMES = require('../../config/auth/resource_names');
const express = require('express');
const router = express.Router({
  mergeParams: true
});
const utils = require('../../helpers/utils');
const FaqService = require('../../services/core/faqService');
const {
  FaqSchema,
  idSchema
} = require('../../validations/validation');
const BaseController = require('../BaseController');

router.post('/', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.FAQ, ['createAny']);
    const data = req.body;
    await req.validate(FaqSchema, data);
    const response = await FaqService.create(data);
    res.send(response);
  } catch (err) {
    next(err);
  }
});
router.get('/', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.FAQ, ['readAny']);
    const filters = req.query;
    const params = req.query;
    const response = await FaqService.getFaqs(filters, params);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.FAQ, ['readAny']);
    const data = {
      id: req.params.id
    };
    await req.validate(idSchema, data);
    const response = await FaqService.getOne(data.id);
    res.send(response);
  } catch (err) {
    next(err);
  }
});
router.put('/:id', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.FAQ, ['updateAny']);
    const data = req.body;
    await req.validate(FaqSchema, data, false);
    await req.validate(idSchema, {
      id: req.params.id
    });
    const response = await FaqService.update(req.params.id, data);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.FAQ, ['deleteAny']);
    await req.validate(idSchema, {
      id: req.params.id
    });
    const response = await FaqService.delete(req.params.id);
    res.send(response);

  } catch (err) {
    next(err);
  }
});
module.exports = new BaseController('/faq', 'private', router);