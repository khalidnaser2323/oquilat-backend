const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

const allowedAreasSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    loc: {
        type: {
            type: String
        },
        coordinates: {
            type: [
                [
                    [Number]
                ]
            ]
        }
    },
    isArchived: {
        type: Boolean,
        default: false
    }

});
allowedAreasSchema.index({
    loc: "2dsphere"
});
module.exports = mongoose.model('AllowedAreas', allowedAreasSchema);