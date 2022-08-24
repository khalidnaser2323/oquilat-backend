const _ = require('lodash');
const ADMIN = 'admin';
const CUSTOMER = 'customer';
const GUEST = 'guest';
const ENGINEER = 'engineer';
const ROLE_NAMES_ENUM = [
    ADMIN,
    CUSTOMER,
    GUEST,
    ENGINEER,
];
const ROLES_NAMES = {
    ADMIN,
    CUSTOMER,
    GUEST,
    ENGINEER,
};

module.exports = {ROLE_NAMES_ENUM, ROLES_NAMES};
