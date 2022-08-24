const _ = require('lodash');
const BaseService = require('../BaseService');
const {
    AllowedAreas
} = require('../../db/models/index');


class AllowedAreaService extends BaseService {
    async create(data) {
        try {
            return await AllowedAreas.create(data);
        } catch (e) {
            throw e;
        }
    }

    async getOne(id) {
        const area = await AllowedAreas.getById(id, {
            lean: true
        });
        if (!area) {
            throw new this.NotFoundError(0, `Area with id ${id} not found`)
        }
        return area;
    }

    async update(id, data) {
        await this.getOne(id);
        return await AllowedAreas.updateById(id, data, {
            new: true
        });
    }

    async delete(id) {
        const area = await this.getOne(id);
        await AllowedAreas.updateById(id, {
            isArchived: true
        });
        return {
            message: `City ${area.name} has been deleted`
        }
    }

    async getAllowedAreas(filters, params = {}, pagination = false) {
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
        return await AllowedAreas.getAll(query, nParams, paginate);
    }

    async checkIfExistInOurPolygon(coordinates) {
        const cord = coordinates.coordinates.split(',');
        const allowedAreas = await AllowedAreas.getOne({
            loc: {
                $geoIntersects: {
                    $geometry: {
                        "type": "Point",
                        "coordinates": cord
                    }
                }
            }
        });
        return allowedAreas;
    }
}

module.exports = new AllowedAreaService();