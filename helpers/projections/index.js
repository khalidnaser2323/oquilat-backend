const Projection = require('./projection');

// const baseUser = '_id email mobile first_name last_name roles token image auth_type restaurant wallet referral_id bookmarks follow orders is_mobile_verified is_email_verified is_verified is_active paymentCards';
// const baseUser = '_id email mobile name roles';
// const baseLogin = '_id email mobile name roles token';
const baseUserLogin = '_id mobile name roles token profile_image search_inputs addresses email is_verified';
const baseUserBasicData = '_id mobile name roles conversations address region location identity_scan notes identification_number profile_image fcm_token search_inputs addresses email is_verified current_status flow_status current_order suggested_orders';
module.exports = {
    pUserLogin: new Projection(baseUserLogin),
    pUserBasicData: new Projection(baseUserBasicData),
// pUserLogin: new Projection(baseLogin),
// pUserLogin: new Projection(baseUser),
// pUserBasicData: new Projection(baseUser),
// pUserRegister: new Projection(baseUser),
//
// pMenuData: new Projection('category index name description price points duration groups cooking images tags likes'),
//
// pRestaurantSearch: new Projection('name description images rating followers publish_permission_id'),
// pRestaurant: new Projection('_id name description tags images publish_permission_id minimum hours delivery express_delivery dine_in pickup cuisines rating reviews followers likes address currency payment vat charges logo serve phones is_verified is_active'),
//
// pEmployeeBasicData: new Projection('_id email mobile first_name last_name roles supervisor image serve is_verified is_active'),
// pEmployeeData: new Projection('_id restaurant email mobile first_name last_name roles supervisor serve image is_verified is_active'),
//
// countryBasicData: new Projection('code name currency phone'),
// countryFullData: new Projection('name currency phone capital languages continent cities'),
// countryCitiesData: new Projection('cities '),
// countryCityData: new Projection('cities._id cities.name cities.areas cities.areas._id cities.areas.name'),
// cityAreasData: new Projection('cities._id cities.areas cities.areas._id cities.areas.name'),
// cityAreaData: new Projection('_id name'),
// orderDetailsData: new Projection('_id payment number paymentInfo paid created_at currency updated_at restaurant table type price status mealsDetails._id mealsDetails.images mealsDetails.is_active mealsDetails.name mealsDetails.price mealsDetails.count mealsDetails.groups mealsDetails.groups._id mealsDetails.groups.name mealsDetails.groups.items mealsDetails.groups.items._id mealsDetails.groups.items.name priceInfo extras'),
// restaurantDetailsData: new Projection('_id dine_in pickup serve phones branch images cuisines tags employees floors tables include_tax vat reviews rating followers is_verified is_active created_at updated_at name description company chain email website cost payment address hours delivery charges currency minimum food_court mall wallet logo supported_languages type reservations read_only publish_permission_id'),
}
;
