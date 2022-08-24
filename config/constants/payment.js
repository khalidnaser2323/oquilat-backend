const PAYMENT_STATUS_ENUM = ['deactive', 'notdetermined', 'paid', 'unpaid', 'forgiven'];
module.exports = {
  PAYMENT_STATUS_ENUM,
  PAYMENT_STATUS: {
    RECEIVED: PAYMENT_STATUS_ENUM[0],
    HANDLING: PAYMENT_STATUS_ENUM[1],
    RESOLVED: PAYMENT_STATUS_ENUM[2]
  },
};