const _ = require('lodash');
const BaseService = require('../BaseService');
const { Bundles } = require('../../db/models/index');

class Bundleservice extends BaseService {

  async create(data) {
    try {
      return await Bundles.create(data);
    } catch (e) {
      throw e;
    }
  }

  async getOne(id) {
    const bundle = await Bundles.getById(id, {
      lean: true
    });
    if (!bundle) {
      throw new this.NotFoundError(0, `bundle with id ${id} not found`)
    }
    return bundle;
  }

  async update(id, data) {
    await this.getOne(id);
    return await Bundles.updateById(id, data, {
      new: true
    });
  }

  async delete(id) {
    const bundle = await this.getOne(id);
    await Bundles.updateById(id, {
      isArchived: true
    });
    return {
      message: `Bundle ${bundle.name} has been deleted`
    }
  }

  async getBundles(filters, params = {}, pagination = false) {
    const nParams = params;
    const query = {};
    if (nParams.name) {
      query['name'] = {
        $regex: new RegExp(filters.name, 'i')
      };
    }
    nParams.lean = true;
    let paginate = pagination;
    if (nParams.pagination) {
      paginate = this.utils.parseBoolean(nParams.pagination);
    }
    nParams.sort = {
      'created_at': -1
    };
    query['isArchived'] = false;
    return await Bundles.getAll(query, nParams, paginate);
  }
}

module.exports = new Bundleservice();