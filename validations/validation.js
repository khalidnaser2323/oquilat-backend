const {
    ROLE_NAMES_ENUM
} = require('../config/auth/roles');
const {
    LANGUAGES_ENUM
} = require('../config/constants/languages');
const {
    COMPLAINT_STATUS_ENUM
} = require('../config/constants/complaint');

const {
    PAYMENT_STATUS_ENUM
} = require('../config/constants/payment');
module.exports = {
    idSchema: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
            },
        },
        required: ['id'],

    },
    loginSchema: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                minLength: 6,
            },
            password: {
                type: 'string',
                minLength: 6,
                maxLength: 20,
            },
            type: {
                type: 'string',
                enum: ROLE_NAMES_ENUM,
            },
            device_id: {
                type: "string"
            }
        },
        required: ['name', 'password', 'type'],
    },
    loginMobileSchema: {
        type: 'object',
        properties: {
            mobile: {
                type: 'string',
                minLength: 6,
                maxLength: 20,
                pattern: '^(\\+|00)\\d+',
            },
            type: {
                type: 'string',
                enum: ROLE_NAMES_ENUM,
            },
            device_id: {
                type: "string"
            }
        },
        required: ['mobile', 'type'],
    },

    emailSchema: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                minLength: 2
            },
            subject: {
                type: 'string',
                minLength: 2
            }
        },
        required: ['email'],
    },
    messageSchema: {
        type: 'object',
        properties: {
            to: {
                type: 'string',
                minLength: 2
            },
            body: {
                type: 'string',
                minLength: 2
            }
        },
        required: ['to', 'body'],
    },
    searchSchema: {
        type: 'object',
        properties: {
            device_id: {
                type: 'string'
            },
            search_input: {
                type: 'string'
            },
        },
        required: ['device_id', 'search_input']
    },
    updateProfileSchema: {
        type: 'object',
        properties: {
            device_id: {
                type: 'string'
            },
            mobile: {
                type: 'string'
            },
            name: {
                type: 'string'
            },
            password: {
                type: 'string',
                minLength: 6,
                maxLength: 20,
            },
            email: {
                type: 'string',
                pattern: '^(([^<>()\\[\\]\\.,;:\\s@\\"]+(\\.[^<>()\\[\\]\\.,;:\\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\\]\\.,;:\\s@\\"]+\\.)+[^<>()[\\]\\.,;:\\s@\\"]{2,})$'
            },
            search_input: {
                type: 'array',
                items: {
                    type: "string"
                }
            },
        },
    },
    citySchema: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                minLength: 3
            },
            translation: {
                type: 'object',
                propertyNames: {
                    enum: LANGUAGES_ENUM
                },
                patternProperties: {
                    '^[a-z]{2}$': {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                minLength: 3
                            },
                        },
                        required: ['name'],
                    },
                },
                "minProperties": 1,
            },

            additionalProperties: false
        },
        required: ['name', 'translation'],
    },
    addressSchema: {
        type: "object",
        properties: {
            address: {
                type: 'string'
            },
            name: {
                type: 'string',
            },
            mobile: {
                type: 'string',
                minLength: 6,
                maxLength: 20,
            },
            special_mark: {
                type: "string"
            },
            area: {
                type: "string"
            },
            city: {
                type: "string"
            },
            default: {
                type: 'boolean'
            }
        },
        required: ['address', 'name', 'mobile', 'special_mark', 'area', 'city']
    },
    complaintSchema: {
        type: 'object',
        properties: {
            mobile: {
                type: 'string'
            },
            text: {
                type: 'string'
            },
            images: {
                type: 'array',
                items: {
                    type: 'string',
                }
            },
            status: {
                type: 'array',
                items: {
                    text: {
                        type: "string",
                        enum: COMPLAINT_STATUS_ENUM
                    },
                }
            }
        },
        required: ['mobile'],

    },
    subscriptionsSchema: {
        type: 'object',
        properties: {
            type: {
                type: 'string'
            },
            isActive: {
                type: 'boolean'
            }

        },
        // required: ['name', 'mobile'],

    },
    bundlesSchema: {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            },
            price: {
                type: 'number'
            },
            speed: {
                type: 'number'
            },
            quota: {
                type: 'number'
            },
        },
        required: ['price', 'speed', 'quota'],
    },
    paymentSchema: {
        type: 'object',
        properties: {
            subscription: {
                type: 'string'
            },
            user: {
                type: 'string'
            },
            payment_status: {
                type: 'string'
            },
            payment_status: {
                type: 'array',
                items: {
                    text: {
                        type: "string",
                        enum: PAYMENT_STATUS_ENUM
                    },
                }
            },
            invoice_price: {
                type: 'number'
            },
        },
        required: ['invoice_price'],
    },
    verifySchema: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
            },
            mobile_token: {
                type: 'number'
            }
        },
        required: ['user', 'mobile_token'],
    },
    AllowedAreaSchema: {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            },
            loc: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string'
                    },
                    coordinates: {
                        type: 'array',
                    }
                }
            },
        },
    },
    FaqSchema: {
        type: 'object',
        properties: {
            question: {
                type: 'string'
            },
            answer: {
                type: 'string'
            },
        },
        required: ['question', 'answer'],
    }
}