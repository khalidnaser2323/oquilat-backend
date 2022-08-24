const mongoose = require('mongoose');
const {Schema} = mongoose;
const areaSchema = new Schema({
    name: {type: String, trim: true},
    city:{type:Schema.Types.ObjectId,ref:"City"},
    translation: {},
    isArchived: {
        type: Boolean,
        default: false
    }

});
areaSchema.index({name: 1});
module.exports = mongoose.model('Area', areaSchema);
