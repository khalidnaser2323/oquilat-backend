const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const request = require('request');
const BaseService = require('../BaseService');
const {
  Subscriptions
} = require('../../db/models/index');
const {
  filter
} = require('lodash');

class SubscriptionsService extends BaseService {

  async create(data) {
    try {
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
          const subscription = await Subscriptions.create(data);
          data.images.forEach((img, i) => {
            const tempImgds = path.join(__dirname, '../../services/temp_images');
            const image = `${tempImgds}/${i}.png`
            fs.unlinkSync(image)
          });
          return subscription;
        }
      } else {
        const subscription = await Subscriptions.create(data);
        return subscription;
      }
    } catch (err) {
      throw err;
    }
  }

  async updateSubscription(id, data) {
    try {
      let result = await Subscriptions.updateById(id, data);
      return result;
    } catch (err) {
      console.log('err in update Subscriptions :', err);
      throw err;
    }
  }


  async getSubscriptions(filters, params = {}, pagination = true) {
    const nParams = params;
    const query = {};
    if (nParams.text) {
      query['text'] = {
        $regex: new RegExp(filters.name, 'i')
      };
    }
    if (nParams.startDate && nParams.endDate) {
      query["created_at"] = {
        $gte: new Date(nParams.startDate),
        $lte: new Date(nParams.endDate),
      };
    }
    if (filters.user) {
      query.user = filters.user;
    }
    nParams.lean = true;
    let paginate = pagination;
    if (nParams.pagination) {
      paginate = this.utils.parseBoolean(nParams.pagination);
    }
    query['isArchived'] = false;
    nParams.sort = {
      'created_at': -1
    };
    nParams.populate = [{
        path: 'user',
        select: '_id name mobile identification_number type email region address identity_scan notes'
      },
      {
        path: 'agentId',
        select: '_id name'
      }
    ]
    return await Subscriptions.getAll(query, nParams, paginate);
  }

  async getOne(id) {
    const nParams = {};
    nParams.lean = true;
    nParams["populate"] = [
      ["user", "_id name mobile identification_number type email region address identity_scan notes"],
      ["bundle", "_id name price speed quota"],
      ["agentId", "_id name"]
    ];
    const subscription = await Subscriptions.getById(id, nParams);
    if (!subscription) {
      throw new this.NotFoundError(0, `Subscriptions with id ${id} not found`)
    }
    return subscription;
  }

  async updateSubscriptionsStatus(subscriptionId, data) {
    const subscription = await Subscriptions.getById(subscriptionId);
    if (!subscription) {
      throw new this.ValidationError(
        0,
        `there is no subscription with this id ${subscriptionId}`
      );
    }
    await this.updateSubscription(subscriptionId, {
      agentId: data.agentId
    })
    subscription.isActive = data.isActive
    await subscription.save();
    return subscription;
  }

  async getSubCount(query) {
    try {
      const count = await Subscriptions.getCount(query);
      return count;
    } catch (error) {
      return error;
    }
  }

  async delete(id) {
    const subscription = await this.getOne(id);
    await Subscriptions.updateById(id, {
      isArchived: true
    });
    return {
      message: `subscription ${subscription.text} has been deleted`
    }
  }
  async search(search) {
    const nParams = {};
    nParams.lean = true;

    nParams.sort = {
      'created_at': -1
    };
    nParams.populate = [{
        path: 'user',
        select: '_id name mobile identification_number type email region address identity_scan notes'
      },
      {
        path: 'bundle',
        select: '_id name price speed quota'
      },
      {
        path: 'agentId',
        select: '_id name'
      },
      {
        path: 'payment',
        select: 'id invoice_url invoice_price payment_status',
        populate: [{
          path: 'agentId',
          select: '_id name'
        }]
      }
    ]
    return await Subscriptions.getAll({
      isArchived: false,
      $text: {
        $search: search.term
      }
    }, nParams)
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

module.exports = new SubscriptionsService();