const _ = require('lodash');
const BaseService = require('../BaseService');
const {
    complaint
} = require('../../db/models/index');

const fs = require('fs');
const path = require('path');
const request = require('request');

class ComplaintService extends BaseService {
    async create(data) {
        try {
            const status = [];
            status.push({
                text: 'received'
            });
            data.status = status;
            if (data.images && data.images.length) {
                let imagesBuffer;
                let promises = [];
                await Promise.all(data.images.map(async (url, i) => {
                    await this.doRequest(url, i, (i === data.images.length - 1));
                }));

                await Promise.all(data.images.map(async (img, i) => {
                    const tempImgds = path.join(__dirname, '../../services/temp_images');
                    const image = `${tempImgds}/${i}.png`;
                    if (image) {
                        const prom = await fs.promises.readFile(path.join(image));
                        const file = {
                            fieldname: Date.now() + i,
                            originalname: `${Date.now() + i}.png`,
                            encoding: '7bit',
                            mimetype: 'application/octet-stream',
                            buffer: prom,
                        }
                        promises.push(file);
                    }
                }));
                imagesBuffer = await Promise.all(promises)
                if (imagesBuffer.length) {
                    data.images = [];
                    const imageOutput = await this.storage.save(imagesBuffer);
                    if (_.isArray(imageOutput)) {
                        data.images = imageOutput;
                    } else {
                        data.images.push(imageOutput);
                    }
                    const compl = await complaint.create(data);
                    data.images.forEach((img, i) => {
                        const tempImgds = path.join(__dirname, '../../services/temp_images');
                        const image = `${tempImgds}/${i}.png`
                        fs.unlinkSync(image)
                    });
                    return compl;
                }
            } else {
                const compl = await complaint.create(data);
                return compl;
            }
        } catch (err) {
            throw err;
        }
    }

    async getOne(id) {
        const nParams = {};
        nParams.lean = true;
        nParams['populate'] = [{
                path: 'agentId',
                select: '_id name'
            },
            {
                path: 'actionText',
                populate: [{
                    path: 'agentId',
                    select: '_id name'
                }]
            }
        ]
        const compl = await complaint.getById(id, nParams);
        if (!compl) {
            throw new this.NotFoundError(0, `complaint with id ${id} not found`)
        }
        return compl;
    }

    async update(id, data) {
        await this.getOne(id);
        return await complaint.updateById(id, data, {
            new: true
        });
    }

    async updateComplaintStatus(complaintId, data) {
        const comp = await complaint.getById(complaintId);
        if (!comp) {
            throw new this.ValidationError(
                0,
                `there is no complaint with this id ${complaintId}`
            );
        }
        if (comp.status[0].text === data.status[0].type[0].text) {
            throw new this.ValidationError(
                0,
                `complaint status is already ${comp.status[0].text} `
            );
        }
        comp.status.unshift({
            text: data.status[0].type[0].text
        });
        const body = {
            agentId: data.agentId
        }
        await this.update(complaintId, body)
        await comp.save();
        return comp;
    }


    async updateComplaintAction(complaintId, data) {
        const comp = await complaint.getById(complaintId);
        if (!comp) {
            throw new this.ValidationError(
                0,
                `there is no complaint with this id ${complaintId}`
            );
        }
        if (data.actionText && data.actionText.length) {
            data.actionText.forEach(text => {
                comp.actionText.push(text)
            })
        }
        const body = {
            agentId: data.agentId
        }
        await this.update(complaintId, body)
        await comp.save();
        return comp;
    }
    async delete(id) {
        const comp = await this.getOne(id);
        await complaint.updateById(id, {
            isArchived: true
        });
        return {
            message: `complaint ${comp.text} has been deleted`
        }
    }

    async getComplaints(filters, params = {}, pagination = true) {
        const nParams = params;
        const query = {};
        if (nParams.text) {
            query['text'] = {
                $regex: new RegExp(filters.name, 'i')
            };
        }
        nParams.lean = true;
        let paginate = pagination;
        if (nParams.pagination) {
            paginate = this.utils.parseBoolean(nParams.pagination);
        }
        query['isArchived'] = false;
        query['type'] = {
            $ne: 'unhandled'
        };
        nParams.sort = {
            'created_at': -1
        };
        nParams.populate = [{
                path: 'agentId',
                select: '_id name'
            },
            {
                path: 'actionText',
                select: 'id anwser created_at updated_at',
                populate: [{
                    path: 'agentId',
                    select: '_id name'
                }]
            }
        ]
        return await complaint.getAll(query, nParams, paginate);
    }

    async getUnHandledQuestions(filters, params = {}, pagination = true) {
        const nParams = params;
        const query = {};
        if (nParams.text) {
            query['text'] = {
                $regex: new RegExp(filters.name, 'i')
            };
        }
        nParams.lean = true;
        let paginate = pagination;
        if (nParams.pagination) {
            paginate = this.utils.parseBoolean(nParams.pagination);
        }
        query['isArchived'] = false;
        query['type'] = 'unhandled';
        nParams.sort = {
            'created_at': -1
        };
        nParams.populate = [{
                path: 'agentId',
                select: '_id name'
            },
            {
                path: 'actionText',
                select: 'id anwser created_at updated_at',
                populate: [{
                    path: 'agentId',
                    select: '_id name'
                }]
            }
        ]
        if (nParams.questionFor) {
            query['questionFor'] = nParams.questionFor;
        }
        return await complaint.getAll(query, nParams, paginate);
    }

    async getUserComplaints(user, params = {}, pagination = false) {
        const nParams = params;
        const query = {};
        nParams.lean = true;
        let paginate = pagination;
        if (nParams.pagination) {
            paginate = this.utils.parseBoolean(nParams.pagination);
        }
        query['isArchived'] = false;
        query["user"] = user;
        nParams.sort = {
            'created_at': -1
        };
        return await complaint.getAll(query, nParams, paginate);
    }

    doRequest(url, index, isLastIteration) {
        return new Promise(function (resolve, reject) {
            request({
                url: url,
                encoding: null
            }, function (error, res, body) {
                if (error) {
                    throw error;
                }
                if (res.statusCode != 200) {
                    throw "Failed to download images from provider";
                }
                const tempImgds = path.join(__dirname, '../../services/temp_images');
                fs.mkdir(tempImgds, {
                    recursive: true
                }, function (fsErr) {
                    if (fsErr) throw (fsErr);
                    fs.writeFile(`${tempImgds}/${index}.png`, body, {
                        encoding: null
                    }, (err) => {
                        if (err) throw err;
                        resolve(true);
                    });
                });
            });
        });
    }
}

module.exports = new ComplaintService();