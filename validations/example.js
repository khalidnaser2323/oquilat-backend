module.exports = {
    exampleSchema: {
        type: 'object',
        properties: {
            invitees: {
                type: 'array',
                items: {
                    type: 'string',
                    pattern: '^[0-9a-fA-F]{24}$',
                },
            },
            invited_to: {pattern: '^[0-9a-fA-F]{24}$'},
            type: {
                type: 'string',
                minLength: 3,
            },
        },
        required: ['invitees', 'invited_to', 'type'],
    },
};
