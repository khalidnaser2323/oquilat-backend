const mongoose = require('mongoose');
const {Schema} = mongoose;
const searchSchema = new Schema({
    device_id: {type: String},
    search_inputs:[{type:String}],

});

module.exports = mongoose.model('Search', searchSchema);
