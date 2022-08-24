const {LANGUAGES_ENUM} = require('../../config/constants/languages');

module.exports = {
    create: {
        type: 'object',
        properties: {
            name: {type: 'string', minLength: 3},
            translation: {
                type: 'object',
                propertyNames: {enum: LANGUAGES_ENUM},
                patternProperties: {
                    '^[a-z]{2}$': {
                        type: 'object',
                        properties: {
                            name: {type: 'string', minLength: 3},
                        },
                        required: ['name'],
                    },
                },
                "minProperties": 1,
            },
            location: {
                type: 'array',
                items: {
                    type: 'array',
                    items: {
                        type: 'number',
                    },
                    minItems: 2,
                    maxItems: 2
                },
                minItems: 3
            },
            additionalProperties: false
        },
        required: ['name', 'translation', 'location'],
    },
};
