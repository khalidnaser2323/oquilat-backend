const mongoose = require('mongoose');
const { Schema } = mongoose;
const { PAYMENT_STATUS, PAYMENT_STATUS_ENUM } = require('../../config/constants/payment');

const statusSchema = new Schema({
  text: { type: String, default: 'notdetermined', enum: ['deactive', 'notdetermined', 'paid', 'unpaid', 'forgiven'], required: true },
  created_at: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const paymentsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true  },
  subscription: { type: Schema.Types.ObjectId, ref: 'Subscriptions', required: true },
  bundle: { type: Schema.Types.ObjectId, ref: 'Bundles'},
  payment_status: [statusSchema],
  invoice_url:  [{ type: String }],
  invoice_price:  { type: Number, required: true},
  agentId: { type: Schema.Types.ObjectId, ref: 'User'},
  payment_id: { type: String }
});
paymentsSchema.index({ name: 1 });
module.exports = mongoose.model('Payments', paymentsSchema);
