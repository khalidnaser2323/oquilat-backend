const _ = require("lodash");
const config = require('../../config');
const axios = require('axios').default;
const BaseService = require("../BaseService");
const {
  User,
  Search
} = require("../../db/models/index");
const {
  ROLES_NAMES
} = require("../../config/auth/roles");
const {
  NOTIFICATION_TYPES
} = require("../../config/constants/notification");
const CityService = require("../core/CityService");
const AreaService = require("../core/AreaService");
const emailService = require("../core/emailService");
const mongoose = require('mongoose');
const {
  Subscriptions
} = require('../../db/models/index');
class UserService extends BaseService {
  async login(reqData) {
    let user = await User.getOne({
      name: reqData.name,
    });
    console.log(user);
    if (!user) {
      const data = {
        name: reqData.name,
        password: reqData.password
      };
      if (reqData.type === ROLES_NAMES.CUSTOMER) {
        data.roles = [ROLES_NAMES.CUSTOMER];
      } else {
        throw new this.UnauthenticatedError(0, `this phone number not exist`);
      }
      if (reqData.device_id) {
        const haveSearch = await Search.getOne({
          device_id: reqData.device_id,
        });
        if (haveSearch) {
          data.search_inputs = haveSearch.search_inputs;
        }
      }
      user = await User.create(data);
    }
    const NotificationLocator = require("../notification_processors/NotificationLocator");
    await NotificationLocator.getNotificationProcessor(
      NOTIFICATION_TYPES.SMS_VERIFICATION
    ).create(user);
    return user;
  }
  async loginWithMobile(mobile, type, reqData) {
    mobile = await this.convertMobileNumberToEnglish(mobile);
    let user = await User.getOne({
      mobile: mobile,
    });
    if (!user) {
      const data = {
        mobile
      };
      if (type === ROLES_NAMES.CUSTOMER) {
        data.roles = [ROLES_NAMES.CUSTOMER];
      } else {
        throw new this.UnauthenticatedError(0, `this phone number not exist`);
      }
      if (reqData.device_id) {
        const haveSearch = await Search.getOne({
          device_id: reqData.device_id,
        });
        if (haveSearch) {
          data.search_inputs = haveSearch.search_inputs;
        }
      }
      user = await User.create(data);
    }
    const NotificationLocator = require("../notification_processors/NotificationLocator");
    await NotificationLocator.getNotificationProcessor(
      NOTIFICATION_TYPES.SMS_VERIFICATION
    ).create(user);
    return user;
  }

  async create(data, files) {
    let user = await User.getOne({
      mobile: data.mobile,
    });
    if (user) {
      throw new this.ValidationError(
        0,
        `there is user with this phone number ${data.mobile}`
      );
    }
    if (!_.isNil(files)) {
      const imageOutput = await this.storage.save(files.identity_scan);
      data.identity_scan = imageOutput;
    }
    data.roles = [data.type];
    user = await User.create(data);
    return user;
  }

  async verify(id, mobile_token) {
    const params = {};
    params.populate = [
      ["addresses.city"],
      ["addresses.area"]
    ];
    let user = await User.getById(id, params);
    if (Date.now() > user.verify_mobile.token_expiration) {
      throw new this.ValidationError(0, `mobile code has expired`);
    }

    if (mobile_token.toString() !== user.verify_mobile.token) {
      throw new this.ValidationError(0, `mobile code is not correct`);
    }
    user.verify_mobile.token = "";
    user.verify_mobile.token_time = "";
    user.verify_mobile.token_expiration = "";
    user.is_verified = true;
    await user.save();
    return user;
  }

  async getUsers(filters, params = {}, pagination = true) {
    const nParams = params;
    const query = {};
    if (nParams.name) {
      query["name"] = {
        $regex: filters.name
      };
    }
    if (nParams.mobile) {
      query["mobile"] = {
        $regex: filters.mobile
      };
    }
    if (filters.role) {
      query["roles.0"] = {
        $in: filters.role
      };
    }
    nParams.lean = true;
    let paginate = pagination;
    if (nParams.pagination) {
      paginate = this.utils.parseBoolean(nParams.pagination);
    }
    nParams.sort = {
      created_at: -1
    };

    nParams.populate = [{
      path: 'conversations',
      select: '_id message type created_at'
    }]
    return await User.getAll(query, nParams, paginate);
  }


  async getUsersConverstions(filters, params = {}, pagination = true) {
    const nParams = params;
    const query = {};
    if (nParams.name) {
      query["name"] = {
        $regex: filters.name
      };
    }
    if (nParams.mobile) {
      query["mobile"] = {
        $regex: filters.mobile
      };
    }
    if (filters.role) {
      query["roles.0"] = {
        $in: filters.role
      };
    }
    nParams.lean = true;
    let paginate = pagination;
    if (nParams.pagination) {
      paginate = this.utils.parseBoolean(nParams.pagination);
    }
    nParams.sort = {
      'conversations.created_at': -1
    };

    nParams.populate = [{
      path: 'conversations',
      select: '_id message type created_at'
    }]
    return await User.getAll(query, nParams, paginate);
  }

  async getOneUserConversations(id, lean = true) {
    const options = {};
    if (lean) {
      options["lean"] = lean;
    }
    const params = {};
    params.sort = {
      'conversations._id': 'asc'
    };
    params.populate = [{
      path: 'conversations',
      select: '_id message type created_at'
    }]
    const user = await User.getOne({
      _id: id
    }, params, options);
    console.log('user', user)
    if (!user) {
      throw new this.NotFoundError(0, `user with id ${id} not found`);
    }
    return user;
  }

  async getUser(id, lean = true) {
    const options = {};
    if (lean) {
      options["lean"] = lean;
    }
    const params = {};
    params.populate = [{
      path: 'conversations',
      select: '_id message type created_at'
    }]
    const user = await User.getOne({
      _id: id
    }, params, options);
    console.log('user', user)
    if (!user) {
      throw new this.NotFoundError(0, `user with id ${id} not found`);
    }
    return user;
  }

  async updateUser(id, data, files) {
    try {
      const user = await this.getUser(id);
      const options = {};
      if (!_.isNil(files)) {
        if (files.profile_image && files.profile_image.length > 0) {
          data.profile_image = await this.storage.save(files.profile_image);
        }
      }
      const params = {};
      params.populate = [
        ["addresses.city"],
        ["addresses.area"]
      ];
      options["new"] = true;
      let result = await User.updateById(id, data, options, params);
      if (data.mobile && data.mobile !== user.mobile) {
        result = await User.updateById(
          id, {
          is_verified: false
        }, {
          new: true
        },
          params
        );
        const NotificationLocator = require("../notification_processors/NotificationLocator");
        await NotificationLocator.getNotificationProcessor(
          NOTIFICATION_TYPES.SMS_VERIFICATION
        ).create(result);
      }
      await user.save();
      return result;
    } catch (err) {
      console.log('err in update profile :', err);
      throw err;
    }
  }

  async updateConverrsation(id, data, files) {
    try {
      const user = await this.getUser(id);
      const options = {};
      const params = {};
      options["new"] = true;
      // console.log('user.conversations', user.conversations);
      // console.log('data.conversations', data.conversations);
      data.conversations.forEach(conv => {
        if (user.conversations && user.conversations.length) {
          user.conversations.unshift(conv);
        } else {
          user['conversations'] = conv;
        }
      });
      let result = await User.updateById(id, data, options, params);
      await user.save();
      global.io.to(user._id).emit('data', JSON.stringify(result.conversations));
      return result;
    } catch (err) {
      console.log('err in update profile :', err);
      throw err;
    }
  }
  async getChatStatus(mobile) {
    const options = {
    };
    options["lean"] = true;
    const params = {};
    const user = await User.getOne({
      mobile: mobile
    }, params, options);
    console.log('user', user)
    if (!user) {
      throw new this.NotFoundError(0, `user with mobile ${mobile} not found`);
    }
    return user;
  }
  async updateChatStatus(id, data) {
    try {
      const user = await this.getUser(id);
      const options = {};
      const params = {};
      options["new"] = true;
      let result = await User.updateById(id, data, options, params);
      await user.save();
      return result;
    } catch (err) {
      console.log('err in update profile :', err);
      throw err;
    }
  }

  async delete(id, userId) {
    const user = await this.getUser(id);

    if (id === userId) {
      throw new this.ValidationError(0, `You can't delete your self :P`);
    }
    // if (user.roles.includes("customer")) {
    //   throw new this.ValidationError(0, `You can't delete customer`);
    // }
    await User.deleteById(id);
    return {
      message: `user ${user.name} deleted`
    };
  }


  async verifyAccount(id, data) {
    const user = await this.getUser(id);
    await user.save();
    return user;
  }

  async convertMobileNumberToEnglish(mobileNumber) {
    let persianNumbers = [
      /۰/g,
      /۱/g,
      /۲/g,
      /۳/g,
      /۴/g,
      /۵/g,
      /۶/g,
      /۷/g,
      /۸/g,
      /۹/g,
    ];
    let arabicNumbers = [
      /٠/g,
      /١/g,
      /٢/g,
      /٣/g,
      /٤/g,
      /٥/g,
      /٦/g,
      /٧/g,
      /٨/g,
      /٩/g,
    ];
    for (let i = 0; i < 10; i++) {
      mobileNumber = mobileNumber
        .replace(persianNumbers[i], i)
        .replace(arabicNumbers[i], i);
    }
    return mobileNumber;
  }

  async addAddress(data, userId) {
    try {
      if (data.name.length < 3) {
        throw new this.ValidationError(0, "please type your full name");
      }
      await CityService.getOne(data.city);
      await AreaService.getOne(data.area);
      const user = await User.getById(userId);
      if (user.addresses.length === 0) {
        data.default = true;
        user.addresses.unshift(data);
        await user.save();
      } else {
        if (_.isBoolean(data.default) && data.default === true) {
          user.addresses.forEach(function (address) {
            address.default = false;
          });
          user.addresses.unshift(data);
          await user.save();
        } else {
          user.addresses.unshift(data);
          await user.save();
        }
      }
      const params = {};
      params.populate = [
        ["addresses.city", ""],
        ["addresses.area", ""],
      ];
      const userData = await User.getOne({
        _id: userId
      }, params);
      return userData;
    } catch (e) {
      throw e;
    }
  }

  async updateAddress(data, userId, addressId) {
    try {
      const user = await User.getById(userId);
      if (data.city) {
        await CityService.getOne(data.city);
      }
      if (data.area) {
        await AreaService.getOne(data.area);
      }
      if (_.isBoolean(data.default) && data.default === true) {
        if (user.addresses.length > 1) {
          user.addresses.forEach(function (address) {
            address.default = false;
          });
          await user.save();
        }
      }
      const setUpdate = {}
      if (data.name) setUpdate["addresses.$.name"] = data.name
      if (data.area) setUpdate["addresses.$.area"] = data.area
      if (data.city) setUpdate["addresses.$.city"] = data.city
      if (data.address) setUpdate["addresses.$.address"] = data.address
      if (data.special_mark) setUpdate["addresses.$.special_mark"] = data.special_mark
      if (data.mobile) setUpdate["addresses.$.mobile"] = data.mobile
      if (data.default) setUpdate["addresses.$.default"] = data.default
      // should insert all object
      const updated = await User.updateOne({
        _id: userId,
        "addresses._id": this.utils.toObjectId(addressId),
      }, {
        $set: setUpdate
      }, {
        new: true
      }, {
        populate: [
          ["addresses.city"],
          ["addresses.area"]
        ]
      });
      console.log(updated);
      return updated;
    } catch (e) {
      throw e;
    }
  }

  async deleteAddress(userId, addressId) {
    try {
      const user = await User.getById(userId);
      const updated = await User.updateOne({
        _id: userId,
      }, {
        $pull: {
          addresses: {
            _id: this.utils.toObjectId(addressId)
          }
        }
      }, {
        new: true
      });
      return updated;
    } catch (e) {
      throw e;
    }
  }

  async getRegisteredClientsCount(startDate, endDate) {
    try {
      const query = {
        roles: {
          $ne: "guest"
        }
      };
      if (startDate && endDate) {
        query["created_at"] = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
      const count = await User.getCount(query);
      return count;
    } catch (error) {
      return error;
    }
  }

  async getSubscribedClientsCount(user) {
    try {
      const query = {
        _id: {
          $ne: user._id
        },
        email: {
          '$exists': true,
          $ne: ""
        },
        roles: {
          $ne: "guest"
        },
        subscribed: true,
      };
      const count = await User.getCount(query);
      return count;
    } catch (error) {
      return error;
    }
  }

  async sendEmail(user, data) {
    const response = {};
    try {
      const query = {
        _id: {
          $ne: user._id
        },
        email: {
          $ne: ""
        },
        roles: {
          $ne: "guest"
        },
        subscribed: true,
      };
      const userData = await User.getOne({
        _id: user._id,
      });
      let users = await User.getAll(query);
      if (users.users && users.users.length !== 0) {
        users.users = users.users.filter((user) => user.email);
        users.users.map(async (user) => {
          await emailService.send(userData, user.email, data.subject, "", data.email, [], {});
        });
        response.success = true;
        response.message = "Email Sent Successfully";
      } else {
        response.success = true;
        response.message = "There Are No Subscribed Users To Send This Email!";
      }
      return response;
    } catch (error) {
      response.success = false;
      response.message = error;
      return response;
      //   return error;
    }
  }
  async sendWhatsMessage(userId, data) {
    try {
      let mobile = data.to.replace("+", "").replace(" ", "").replace("(", "").replace(")", "");
      if (mobile.startsWith("00")) {
        mobile = mobile.replace("00", "");
      }
      let request = {
        "to": mobile,
        "type": "text",
        "recipient_type": "individual",
        "text": {
          "body": data.body
        }
      };
      let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": config.messagingServices.token
      }
      await axios.post(config.messagingServices.endPoint, request, { headers: headers });
      let convData = { "conversations": [{ "message": data.body, "type": "bot" }] };
      let result = await this.updateConverrsation(userId, convData);
      return result;
    } catch (error) {
      return error;
    }
  }

  async search(search) {
    const nParams = {};
    nParams.sort = {
      'created_at': -1
    };
    return await User.getAll({
      $text: {
        $search: search.term
      }
    }, nParams)
  }
  // async createUsersFromJson() {
  //   const {connections} = mongoose;

  //   subscriptionsList.forEach(async sub => {
  //     const subscription = await Subscriptions.getAll({
  //       order_id: sub.order_id
  //     });
  //     if (subscription?.subscriptions?.length) {
  //       const ord = subscription.subscriptions[0]
  //       const body = {
  //         primary_ip: sub.primary_ip,
  //         secondary_ip: sub.secondary_ip
  //       }
  //         console.log('body', body);
  //       let result = await Subscriptions.updateById(ord._id, body);
  //     }
  //   })
  // }
}

module.exports = new UserService();