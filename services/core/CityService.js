const _ = require('lodash');
const BaseService = require('../BaseService');
const {City} = require('../../db/models/index');

class CityService extends BaseService {
    async create(data) {
        try {
            await this.validateCityName(data);
            return await City.create(data);
        } catch (e) {
            throw e;
        }
    }

    async getOne(id) {
        const city = await City.getById(id, {lean: true});
        if (!city) {
            throw new this.NotFoundError(0, `City with id ${id} not found`)
        }
        return city;
    }

    async update(id, data) {
        await this.getOne(id);
        return await City.updateById(id, data, {new: true});
    }

    async delete(id) {
        const city = await this.getOne(id);
        await City.updateById(id, {isArchived: true});
        return {message: `City ${city.name} has been deleted`}
    }

    async getCities(filters, params = {}, pagination = false) {
        const nParams = params;
        const query = {};
        if (nParams.name) {
            query['name'] = {$regex: new RegExp(filters.name, 'i')};
        }
        nParams.lean = true;
        let paginate = pagination;
        if (nParams.pagination) {
            paginate = this.utils.parseBoolean(nParams.pagination);
        }
        nParams.sort = {'created_at': -1};
        return await City.getAll(query, nParams, paginate);
    }

    async validateCityName(data) {
        const city = await City.getOne({name: data.name, isArchived: false});
        if (city) {
            throw new this.ValidationError(0, `this city ${data.name} already exists`);
        }
        return city;
    }

}

module.exports = new CityService();
