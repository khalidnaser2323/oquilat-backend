const express = require('express');
const router = express.Router();
const {
  complaintSchema,
  idSchema
} = require('../../validations/validation');
RESOURCE_NAMES = require('../../config/auth/resource_names');
const BaseController = require('../BaseController');
const complaintService = require('../../services/core/ComplaintService');

router.post('/', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.COMPLAINT, ['createAny']);
    const data = req.body;
    data.user = req.user_id;
    await req.validate(complaintSchema, data);
    let result = await complaintService.create(data);
    res.send(result);
  } catch (err) {
    next(err);
  }
});


router.put('/:id', async function (req, res, next) {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.COMPLAINT, ['updateAny']);
    const data = req.body;
    await req.validate(complaintSchema, data);
    const complaintId = req.params.id;
    const result = await complaintService.update(complaintId, data);
    res.send(result);
  } catch (e) {
    next(e);
  }
});

router.put('/:id/updateStatus', async function (req, res, next) {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.COMPLAINT, ['updateAny']);
    const data = req.body;
    await req.validate(complaintSchema, data);
    const complaintId = req.params.id;
    const result = await complaintService.updateComplaintStatus(complaintId, data);
    res.send(result);
  } catch (e) {
    next(e);
  }
});

router.put('/:id/updateActionText', async function (req, res, next) {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.COMPLAINT, ['updateAny']);
    const data = req.body;
    await req.validate(complaintSchema, data);
    const complaintId = req.params.id;
    const result = await complaintService.updateComplaintAction(complaintId, data);
    res.send(result);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.COMPLAINT, ['deleteAny']);
    req.validate(idSchema, {
      id: req.params.id
    });
    const complaintId = req.params.id;
    const response = await complaintService.delete(complaintId);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.get('/', async function (req, res, next) {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.COMPLAINT, ['readAny']);
    const filters = req.query;
    const params = req.query;
    const response = await complaintService.getComplaints(filters, params);
    res.send(response);
  } catch (e) {
    next(e);
  }
});
router.get('/questions/unhandled', async function (req, res, next) {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.COMPLAINT, ['readAny']);
    const filters = req.query;
    const params = req.query;
    const response = await complaintService.getUnHandledQuestions(filters, params);
    res.send(response);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await req.authorize(req.user, RESOURCE_NAMES.COMPLAINT, ['readAny']);
    req.validate(idSchema, {
      id: req.params.id
    });
    const complaintId = req.params.id;
    const response = await complaintService.getOne(complaintId);
    res.send(response);
  } catch (err) {
    next(err);
  }
});


module.exports = new BaseController('/complaints', 'private', router);