const mongoose = require('mongoose');
const {Schema} = mongoose;
const bundlesSchema = new Schema({
    name: {type: String, trim: true},
    price: {type: Number, required: true},
    speed: {type: Number, required: true},
    quota: {type: Number, required: true},
    isArchived: {
        type: Boolean,
        default: false
    }

});
bundlesSchema.index({name: 1});
module.exports = mongoose.model('Bundles', bundlesSchema);
