const express = require('express');
const router = express.Router();
const BaseController = require('../BaseController');
RESOURCE_NAMES = require('../../config/auth/resource_names');
const {
  paymentSchema,
  idSchema
} = require('../../validations/validation');
const paymentService = require('../../services/core/PaymentService');
const SubscriptionsService = require('../../services/core/SubscriptionsService');

router.post('/', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.PAYMENTS, ['createAny']);
    const data = req.body;
    await req.validate(paymentSchema, data);
    let result = await paymentService.create(data);
    if (data.subscription) {
      await SubscriptionsService.updateSubscription(data.subscription, {
        payment: result._id
      })
    }
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.get('/', async function (req, res, next) {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.PAYMENTS, ['readAny']);
    const filters = req.query;
    const params = req.query;
    const response = await paymentService.getPayments(filters, params);
    res.send(response);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.PAYMENTS, ['readAny']);
    req.validate(idSchema, {
      id: req.params.id
    });
    const paymentId = req.params.id;
    const response = await paymentService.getOne(paymentId);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.put('/:id/updateStatus', async function (req, res, next) {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.PAYMENTS, ['updateAny']);
    const data = req.body;
    await req.validate(paymentSchema, data);
    const paymentId = req.params.id;
    const result = await paymentService.updatePaymentsStatus(paymentId, data);
    res.send(result);
  } catch (e) {
    next(e);
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.PAYMENTS, ['deleteAny']);
    req.validate(idSchema, {
      id: req.params.id
    });
    const paymentId = req.params.id;
    const response = await paymentService.delete(paymentId);
    res.send(response);
  } catch (err) {
    next(err);
  }
});



module.exports = new BaseController('/payments', 'private', router);