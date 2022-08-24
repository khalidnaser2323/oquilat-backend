const User = require('../ModelsFactory').create('User');
const Search = require('../ModelsFactory').create('Search');
const City = require('../ModelsFactory').create('City');
const Area = require('../ModelsFactory').create('Area');
const complaint = require('../ModelsFactory').create('complaint');
const Subscriptions = require('../ModelsFactory').create('Subscriptions');
const Bundles = require('../ModelsFactory').create('Bundles');
const Payments = require('../ModelsFactory').create('Payments');
const AllowedAreas = require('../ModelsFactory').create('AllowedAreas');
const Faq = require('../ModelsFactory').create('Faq');

module.exports = {
    User,
    Search,
    City,
    Area,
    complaint,
    Subscriptions,
    Bundles,
    Payments,
    AllowedAreas,
    Faq
};