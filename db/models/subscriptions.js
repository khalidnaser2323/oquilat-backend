const mongoose = require('mongoose');
const { Schema } = mongoose;

const subscriptionsSchema = new Schema({
  name: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  mobile: { type: String },
  isArchived: {type: Boolean, default: false},
  agentId: { type: Schema.Types.ObjectId, ref: 'User' },
  images: [{ type: String }]
});
subscriptionsSchema.index({'$**': 'text'});
module.exports = mongoose.model('Subscriptions', subscriptionsSchema).createIndexes();
