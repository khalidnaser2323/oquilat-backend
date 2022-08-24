const mongoose = require('mongoose');
const {Schema} = mongoose;
const citySchema = new Schema({
    name: {type: String, trim: true},
    translation: {},
    isArchived: {
        type: Boolean,
        default: false
    }

});
citySchema.index({name: 1});
module.exports = mongoose.model('City', citySchema);
