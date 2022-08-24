const _ = require('lodash');
const BaseService = require('../BaseService');
const { Faq } = require('../../db/models/index');

class FaqService extends BaseService {
  async create(data) {
    try {
      return await Faq.create(data);
    } catch (e) {
      throw e;
    }
  }

  async getOne(id) {
    const faq = await Faq.getById(id, { lean: true });
    if (!faq) {
      throw new this.NotFoundError(0, `faq with id ${id} not found`)
    }
    return faq;
  }

  async update(id, data) {
    await this.getOne(id);
    return await Faq.updateById(id, data, { new: true });
  }

  async delete(id) {
    const faq = await this.getOne(id);
    await Faq.updateById(id, { isArchived: true });
    return { message: ` ${faq.question} has been deleted` }
  }


  async getFaqs(filters, params = {}, pagination = true) {
    const nParams = params;
    const query = {};
    nParams.lean = true;
    query['isArchived'] = false;
    let paginate = pagination;
    if (nParams.pagination) {
      paginate = this.utils.parseBoolean(nParams.pagination);
    }
    nParams.sort = {
      created_at: -1
    };
    return await Faq.getAll(query, nParams, paginate);
  }

}

module.exports = new FaqService();
