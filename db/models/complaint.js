const mongoose = require('mongoose');
const { Schema } = mongoose;
const { COMPLAINT_STATUS, COMPLAINT_STATUS_ENUM } = require('../../config/constants/complaint');
const {
  ASKFOR
} = require('../../config/constants/common');

const statusSchema = new Schema({
  text: { type: String, default: 'received', enum: ['received', 'handling', 'resolved'], required: true },
  created_at: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

  answerSchema = new Schema({
    anwser: {type: String},
    agentId: { type: Schema.Types.ObjectId, ref: 'User' }
  })

const complaintSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  mobile: { type: String },
  images: [{ type: String }],
  text: { type: String, trim: true },
  status: [statusSchema],
  isArchived: {
    type: Boolean,
    default: false
  },
  agentId: { type: Schema.Types.ObjectId, ref: 'User' },
  actionText: [answerSchema],
  type: { type: String },
  questionFor: {
    type: String,
    enum: ASKFOR
  },
});
complaintSchema.index({ name: 1 });
module.exports = mongoose.model('complaint', complaintSchema);
