const express = require('express');
const router = express.Router();
const BaseController = require('../BaseController');
RESOURCE_NAMES = require('../../config/auth/resource_names');
const {
  subscriptionsSchema,
  idSchema
} = require('../../validations/validation');
const SubscriptionsService = require('../../services/core/SubscriptionsService');
const userService = require('../../services/core/UserService');

router.post('/', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.SUBSCRIPTIONS, ['createAny']);
    const data = req.body;
    if (!data.user) {
      data.user = req.user_id;
    }
    await req.validate(subscriptionsSchema, data);
    let result = await SubscriptionsService.create(data);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.get('/', async function (req, res, next) {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.SUBSCRIPTIONS, ['readAny']);
    const filters = req.query;
    const params = req.query;
    const response = await SubscriptionsService.getSubscriptions(filters, params);
    res.send(response);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.SUBSCRIPTIONS, ['readAny']);
    req.validate(idSchema, {
      id: req.params.id
    });
    const subscriptionId = req.params.id;
    const response = await SubscriptionsService.getOne(subscriptionId);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.put('/:id/updateStatus', async function (req, res, next) {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.SUBSCRIPTIONS, ['updateAny']);
    const data = req.body;
    await req.validate(subscriptionsSchema, data);
    const subscriptionId = req.params.id;
    const result = await SubscriptionsService.updateSubscriptionsStatus(subscriptionId, data);
    res.send(result);
  } catch (e) {
    next(e);
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.SUBSCRIPTIONS, ['deleteAny']);
    req.validate(idSchema, {
      id: req.params.id
    });
    const subId = req.params.id;
    const response = await SubscriptionsService.delete(subId);
    res.send(response);
  } catch (err) {
    next(err);
  }
});



router.get('/count/all', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.SUBSCRIPTIONS, ['readAny']);
    const query = {
      isActive: false
    };
    const active = await SubscriptionsService.getSubCount({
      isActive: true,
      isArchived: false,
    });
    const inactive = await SubscriptionsService.getSubCount({
      isActive: false,
      isArchived: false,
    });
    res.send({
      activeCount: active,
      inactiveCount: inactive
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.SUBSCRIPTIONS, ['updateAny', 'updateOwn']);
    const data = req.body;
    const id = req.params.id;
    await req.validate(subscriptionsSchema, data, false);
    let response = await SubscriptionsService.updateSubscription(id, data);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.get('/search/text', async function (req, res, next) {
  try {
    const result = await userService.search(req.query);
    if (result.users.length) {
      const subs = []
      await Promise.all(result.users.map(async (user) => {
        const response = await SubscriptionsService.getSubscriptions({
          user: user._id
        }, {});
        if(response?.subscriptions?.length) {
          subs.push(response.subscriptions[0]);
        }
      }));
      res.send({subscriptions: subs});
    } else {
      res.send({subscriptions:[]});
    }
  } catch (e) {
    next(e);
  }
});


module.exports = new BaseController('/orders', 'private', router);