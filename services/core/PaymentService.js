const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const request = require('request');
const BaseService = require('../BaseService');
const {
  Payments
} = require('../../db/models/index');

class PaymentService extends BaseService {

  async create(data) {
    try {
      if (!data.payment_status) {
        const payment_status = [];
        // payment_status.push({ text: 'notdetermined' });
        data.payment_status = payment_status;
      } else {
        data.payment_status = data.payment_status[0].type;
      }
      if (data.invoice_url && data.invoice_url.length) {
        let imagesBuffer;
        let promises = [];
        await Promise.all(data.invoice_url.map(async (url, i) => {
          await this.doRequest(url, i, (i === data.invoice_url.length - 1));
        }));

        await Promise.all(data.invoice_url.map(async (img, i) => {
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
          data.invoice_url = [];
          const imageOutput = await this.storage.save(imagesBuffer);
          if (_.isArray(imageOutput)) {
            data.invoice_url = imageOutput;
          } else {
            data.invoice_url.push(imageOutput);
          }
          const payment = await Payments.create(data);
          data.invoice_url.forEach((img, i) => {
            const tempImgds = path.join(__dirname, '../../services/temp_images');
            const image = `${tempImgds}/${i}.png`
            fs.unlinkSync(image)
          });
          return payment;
        }
      } else {
        const payment = await Payments.create(data);
        return payment;
      }
    } catch (err) {
      throw err;
    }
  }

  async getPayments(filters, params = {}, pagination = true) {
    const nParams = params;
    const query = {};
    if (nParams.startDate && nParams.endDate) {
      query["created_at"] = {
        $gte: new Date(nParams.startDate),
        $lte: new Date(nParams.endDate),
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
    nParams["populate"] = [
      ["user", "_id name mobile"],
      ["bundle", "_id name price speed quota"],
      ["subscription", "_id"],
      ["agentId", "_id name"]
    ];
    return await Payments.getAll(query, nParams, paginate);
  }

  async getOne(id) {
    const nParams = {};
    nParams.lean = true;
    nParams["populate"] = [
      ["user", "_id name mobile"],
      ["bundle", "_id name price speed quota"],
      ["subscription", "_id"],
      ["agentId", "_id name"]
    ];
    const payment = await Payments.getById(id, nParams);
    if (!payment) {
      throw new this.NotFoundError(0, `payments with id ${id} not found`)
    }
    return payment;
  }


  async updatePaymentsStatus(paymentId, data) {
    const payment = await Payments.getById(paymentId);
    if (!payment) {
        throw new this.ValidationError(
            0,
            `there is no payment with this id ${paymentId}`
        );
    }
    if (payment?.payment_status[0]?.text === data?.payment_status[0]?.type[0]?.text) {
        throw new this.ValidationError(
            0,
            `payment payment_status is already ${payment.payment_status[0].text} `
        );
    }
    payment.payment_status.unshift({
        text: data?.payment_status[0]?.type[0]?.text
    });
    await this.updatePatment(paymentId, {
      agentId: data.agentId
    })
    await payment.save();
    return payment;
}


async updatePatment(id, data) {
  try {
    let result = await Payments.updateById(id, data);
    return result;
  } catch (err) {
    console.log('err in update Payments :', err);
    throw err;
  }
}

  async delete(id) {
    const payment = await this.getOne(id);
    await Payments.updateById(id, {
      isArchived: true
    });
    return {
      message: `payment  has been deleted`
    }
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

module.exports = new PaymentService();