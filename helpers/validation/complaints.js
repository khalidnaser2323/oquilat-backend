module.exports = {
  create: {
      type: 'object',
      properties: {
          text: {type: 'string', minLength: 3},
          
      },
      required: ['text'],
      additionalProperties: false
  }
};
