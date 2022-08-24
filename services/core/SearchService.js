const _ = require('lodash');
const BaseService = require('../BaseService');
const {Search} = require('../../db/models/index');

class SearchService extends BaseService {
    async create(data) {
        try {
            if (data.user.roles.includes('guest')) {
                const checkDeviceIdExist = await Search.getOne({device_id: data.device_id});
                if (checkDeviceIdExist) {
                    if (checkDeviceIdExist.search_inputs.includes(data.search_input)) {
                        return;
                    }
                    if (checkDeviceIdExist.search_inputs.length >= 5) {
                        checkDeviceIdExist.search_inputs.pop();
                        checkDeviceIdExist.search_inputs.unshift(data.search_input);
                        await checkDeviceIdExist.save();
                        return checkDeviceIdExist;
                    } else {
                        checkDeviceIdExist.search_inputs.unshift(data.search_input);
                        await checkDeviceIdExist.save();
                        return checkDeviceIdExist;
                    }

                } else {
                    const createNew = await Search.create({
                        device_id: data.device_id,
                        search_inputs: [data.search_input]
                    });
                    return createNew;
                }
            } else {
                if (data.user.search_inputs.includes(data.search_input)) {
                    return
                }
                const updateSearchinputs = await this.updateSearchInputsToLoggedUser(data.user, data.search_input);
                return updateSearchinputs;
            }
        } catch (err) {
            throw err;
        }
    }

    async getSearchInputsByDeviceId(deviceId) {
        return await Search.getOne({device_id: deviceId});

    }

    async updateSearchInputsToLoggedUser(user, search_input) {
        if (user.search_inputs.length >= 5) {
            user.search_inputs.pop();
            user.search_inputs.unshift(data.search_input);
            await user.save();
            return user;
        } else {
            user.search_inputs.unshift(search_input);
            await user.save();
            return user;
        }

    }
    async deleteSearchInputsByDeviceId(deviceId) {

        const search= await Search.getOne({device_id: deviceId});
        if(!search){
            throw new this.NotFoundError(0,`there is no search inputs with this device`)
        }
        return await Search.updateOne({device_id:deviceId},{search_inputs:[]},{new:true});
    }

}

module.exports = new SearchService();
