const _ = require('lodash');
const BaseService = require('../BaseService');
const CityService = require('../core/CityService');
const {Area} = require('../../db/models/index');

class AreaService extends BaseService {
    async create(data) {
        try {
            await CityService.getOne(data.city);
            await this.validateCityName(data);
            return await Area.create(data);
        } catch (e) {
            throw e;
        }
    }

    async getOne(id) {
        const area = await Area.getById(id, {lean: true});
        if (!area) {
            throw new this.NotFoundError(0, `Area with id ${id} not found`)
        }
        return area;
    }

    async update(id, data) {
        await this.getOne(id);
        return await Area.updateById(id, data, {new: true});
    }

    async delete(id) {
        const area = await this.getOne(id);
        await Area.updateById(id, {isArchived: true});
        return {message: `City ${area.name} has been deleted`}
    }

    async getCities(cityId,filters, params = {}, pagination = false) {
        const nParams = params;
        const query = {};
        if (nParams.name) {
            query['name'] = {$regex: new RegExp(filters.name, 'i')};
        }
        nParams.lean = true;
        let paginate = pagination;
        if (nParams.pagination) {
            pagination = this.utils.parseBoolean(nParams.pagination);
        }
        nParams.sort = {'created_at': -1};
        query['city']=cityId;
        return await Area.getAll(query, nParams, pagination);
    }

    async validateCityName(data) {
        const area = await Area.getOne({name: data.name, isArchived: false});
        if (area) {
            throw new this.ValidationError(0, `this Area ${data.name} already exists`);
        }
        return area;
    }

}

module.exports = new AreaService();
