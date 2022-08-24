const _ = require('lodash');
const Ajv = require('ajv');
const ac = require('../../config/auth/authorization');
const {
    ValidationError,
    UnauthorizedError,
} = require('../../helpers/errors/index');

const accessType = ['createOwn', 'createAny', 'readOwn', 'readAny', 'updateOwn', 'updateAny', 'deleteOwn', 'deleteAny'];

module.exports = (req, res, next) => {
    // Validation /////////////////////////////////////////////////
    req.validate = (schema, data, strict = true) => {
        const ajv = new Ajv();
        const nSchema = schema;
        if (!strict) {
            delete nSchema.required;
        }
        const valid = ajv.validate(nSchema, data);
        if (!valid) {
            console.log(ajv.errors);
            throw new ValidationError(null, ajv.errors);
        }
    };

    req.isValid = (schema, data, strict = true) => {
        const ajv = new Ajv();
        const nSchema = schema;

        if (!strict) {
            delete nSchema.required;
        }
        return ajv.validate(nSchema, data);
    };
    const checkFields = (fields = []) => {
        let count = fields.length;
        let positive = 0;
        let negative = 0;

        _.forEach(fields, (field) => {
            if (field === '_id' || (field.startsWith('-') && field.substr(1) === '_id')) {
                count -= 1;
                return;
            }

            if (field.startsWith('-')) {
                negative += 1;
            } else {
                positive += 1;
            }
        });

        let result = 0;
        if (negative === count) {
            result = -1;
        } else if (positive === count) {
            result = 1;
        }

        return (result);
    };

    const getAllowedFields = (userFields, permissionAttrs) => {
        const fields = _.isNil(userFields) ? [] : userFields.split(/\s/);
        const attributes = permissionAttrs;
        const fieldsType = checkFields(fields);
        let allowedAttrs = [];

        if (fieldsType === 0) {
            throw new ValidationError(0, 'Fields cannot have a mix of inclusion and exclusion');
        }

        if (attributes.indexOf('*') >= 0) {
            _.forEach(attributes, (attr) => {
                if (attr === '*') {
                    return;
                }

                const pAttr = attr.substr(1);
                const fIdx = fields.indexOf(pAttr);

                if (fIdx >= 0) {
                    fields.splice(fIdx, 1);
                }

                if (fieldsType === -1
                    || fields.length === 0
                    || (fields.indexOf('-_id') >= 0 && fields.length === 1)) {
                    fields.push(`-${pAttr}`);
                }
            });

            // add other fields
            _.forEach(fields, (field) => {
                allowedAttrs.push(field);
            });
        } else {
            allowedAttrs = attributes;
        }

        if (allowedAttrs.length > 0) {
            allowedAttrs = allowedAttrs.join(' ');
        } else {
            allowedAttrs = undefined;
        }

        return allowedAttrs;
    };

    /**
     * authorize user.roles to access select resource
     * if access needed only to own resources, will match user._id with required resource id
     * @param user: current logged in user
     * @param resource: accessControl resource
     * @param access: accessControl access string or array of strings - check accessType
     * @param predicate: predicate function
     */
    req.authorize = async (user, resource, access, predicate) => {
        try {
            if (_.isNil(user)) {
                throw new UnauthorizedError();
            }

            const {roles} = user;
            let permission;
            let allowed = false;
            let userAccess;
            let nAccess = access;

            if (_.isString(access)) {
                nAccess = [access];
            }

            if (_.intersection(nAccess, accessType).length !== nAccess.length) {
                throw new ValidationError('authorize hook: invalid access type');
            }

            for (let i = 0; i < nAccess.length; i += 1) {
                permission = ac.can(roles)[nAccess[i]](resource);
                if (permission.granted) {
                    userAccess = nAccess[i];
                    if (!_.isNil(predicate)) {
                        if (userAccess.toLowerCase().endsWith('own')) {
                            const result = await predicate();

                            if (result) {
                                allowed = true;
                                break;
                            }

                            continue;
                        }
                    }

                    allowed = true;
                    break;
                }
            }

            if (permission.granted === true && allowed === true) {
                // Update projection fields based on allowed attributes in permission
                const {fields} = req.query;
                const {attributes} = permission;
                if (attributes.length === 0 || (attributes.length === 0 && attributes[0] === '*')) {
                    // All attributes are allowed
                    return;
                }
                // Get allowed attributes and pass to normal fields used by user
                const allowedFields = getAllowedFields(fields, attributes);
                if (!_.isNil(allowedFields)) {
                    req.query.fields = allowedFields;
                }

                // clean body data according to allowed attrs
                if (!_.isNil(req.body)) {
                    req.body = permission.filter(req.body);
                }
                if (!_.isNil(req.files)) {
                    const filesExist = {};
                    const files = Object.keys(req.files);
                    for (let i = 0; i < files.length; i++) {
                        filesExist[files[i]] = true;
                    }
                    const acceptedFiles = permission.filter({uploadingFiles: filesExist}).uploadingFiles || {};
                    for (let i = 0; i < files.length; i++) {
                        if (acceptedFiles[files[i]] !== true) {
                            delete req.files[files[i]];
                        }
                    }
                }

            } else {
                throw new UnauthorizedError();
            }
        } catch (err) {
            throw err;
        }
    };

    req.log = (payload) => {
        // Apply non destructive merge
        if (_.isNil(payload)) {
            return;
        }

        if (_.isNil(res.locals.logObject)) {
            res.locals.logObject = {};
        }

        Object.keys(payload).forEach((key) => {
            if (!res.locals.logObject[key]) {
                res.locals.logObject[key] = payload[key];
            }
        });
    };

    next();
};
