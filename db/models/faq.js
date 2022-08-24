const mongoose = require('mongoose');
const {Schema} = mongoose;
const faqSchema = new Schema({
question: {type: String, trim: true},
answer: {type: String, trim: true},
    isArchived: {
        type: Boolean,
        default: false
    }

});
faqSchema.index({name: 1});
module.exports = mongoose.model('Faq', faqSchema);
