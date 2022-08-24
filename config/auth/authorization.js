const AccessControl = require('accesscontrol');
const RESOURCE_NAMES = require('./resource_names');
const {
    ROLES_NAMES
} = require('./roles');
//uploadingFiles.personal_files
const grantsObject = {
    [ROLES_NAMES.ADMIN]: {
        [RESOURCE_NAMES.USER]: {
            'read:any': ['*'],
            'create:any': ['*'],
            'delete:any': ['*'],
            'update:any': ['*']
        },
        [RESOURCE_NAMES.CITY]: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        [RESOURCE_NAMES.AREA]: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        [RESOURCE_NAMES.COMPLAINT]: {
            'read:any': ['*'],
            'create:any': ['*'],
            'delete:any': ['*'],
            'update:any': ['*']
        },
        [RESOURCE_NAMES.SUBSCRIPTIONS]: {
            'read:any': ['*'],
            'create:any': ['*'],
            'delete:any': ['*'],
            'update:any': ['*']
        },
        [RESOURCE_NAMES.BUNDLES]: {
            'read:any': ['*'],
            'create:any': ['*'],
            'delete:any': ['*'],
            'update:any': ['*']
        },
        [RESOURCE_NAMES.PAYMENTS]: {
            'read:any': ['*'],
            'create:any': ['*'],
            'delete:any': ['*'],
            'update:any': ['*']
        },
        [RESOURCE_NAMES.ALLOWEDAREAS]: {
            'read:any': ['*'],
            'create:any': ['*'],
            'delete:any': ['*'],
            'update:any': ['*']
        },
        [RESOURCE_NAMES.FAQ]: {
            'read:any': ['*'],
            'create:any': ['*'],
            'delete:any': ['*'],
            'update:any': ['*']
        },
    },
    [ROLES_NAMES.ENGINEER]: {
        [RESOURCE_NAMES.USER]: {
            'read:any': ['*'],
            'create:any': ['*'],
            'delete:any': ['*'],
            'update:any': ['*']
        },
        [RESOURCE_NAMES.CITY]: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        [RESOURCE_NAMES.AREA]: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
        [RESOURCE_NAMES.COMPLAINT]: {
            'read:any': ['*'],
            'create:any': ['*'],
            'delete:any': ['*'],
            'update:any': ['*']
        },
        [RESOURCE_NAMES.SUBSCRIPTIONS]: {
            'read:any': ['*'],
            'create:any': ['*'],
            'delete:any': ['*'],
            'update:any': ['*']
        },
        [RESOURCE_NAMES.BUNDLES]: {
            'read:any': ['*'],
            'create:any': ['*'],
            'delete:any': ['*'],
            'update:any': ['*']
        },
        [RESOURCE_NAMES.PAYMENTS]: {
            'read:any': ['*'],
            'create:any': ['*'],
            'delete:any': ['*'],
            'update:any': ['*']
        },
        [RESOURCE_NAMES.ALLOWEDAREAS]: {
            'read:any': ['*'],
            'create:any': ['*'],
            'delete:any': ['*'],
            'update:any': ['*']
        },
        [RESOURCE_NAMES.FAQ]: {
            'read:any': ['*'],
            'create:any': ['*'],
            'delete:any': ['*'],
            'update:any': ['*']
        },
    },
    [ROLES_NAMES.CUSTOMER]: {
        [RESOURCE_NAMES.USER]: {
            'read:own': ['*'],
            'update:own': ['*'],
            'delete:own': ['*']

        },
        [RESOURCE_NAMES.CITY]: {
            'read:any': ['*']
        },
        [RESOURCE_NAMES.AREA]: {
            'read:any': ['*']
        },
        [RESOURCE_NAMES.COMPLAINT]: {
            'create:any': ['*'],
            'read:any': ['*']
        },
        [RESOURCE_NAMES.SUBSCRIPTIONS]: {
            'create:any': ['*'],
            'read:any': ['*']
        },
        [RESOURCE_NAMES.BUNDLES]: {
            'read:any': ['*'],
        },
        [RESOURCE_NAMES.PAYMENTS]: {
            'create:any': ['*'],
            'read:any': ['*'],
        },
        [RESOURCE_NAMES.ALLOWEDAREAS]: {
            'read:any': ['*'],
        },
        [RESOURCE_NAMES.FAQ]: {
            'read:any': ['*']
        },
    },

    [ROLES_NAMES.GUEST]: {
        [RESOURCE_NAMES.USER]: {
            'read:any': ['*'],
            'create:any': ['*'],
            'delete:any': ['*'],
            'update:any': ['*']
        },
        [RESOURCE_NAMES.CITY]: {
            'read:any': ['*'],
        },
        [RESOURCE_NAMES.AREA]: {
            'read:any': ['*'],
        },
        [RESOURCE_NAMES.COMPLAINT]: {
            'read:any': ['*'],
            'create:any': ['*'],
        },
        [RESOURCE_NAMES.SUBSCRIPTIONS]: {
            'read:any': ['*'],
        },
        [RESOURCE_NAMES.BUNDLES]: {
            'read:any': ['*'],
        },
        [RESOURCE_NAMES.PAYMENTS]: {
            'read:any': ['*'],
        },
        [RESOURCE_NAMES.ALLOWEDAREAS]: {
            'read:any': ['*'],
        },
        [RESOURCE_NAMES.FAQ]: {
            'read:any': ['*']
        },
    },
};
module.exports = new AccessControl(grantsObject);