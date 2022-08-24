const _ = require('lodash');
const multer = require('multer');
// const ImageProcessingUtils = require('../../utils/image-processing-utils');
const { ValidationError } = require('../../helpers/errors/index');
const { IMAGES_UPLOAD_DEFAULT_EXTENSIONS, DOC_UPLOAD_DEFAULT_EXTENSIONS, ALLOWED_FILE_TYPES } = require('../../config/constants/common');

const IMAGES_EXT = IMAGES_UPLOAD_DEFAULT_EXTENSIONS;
const DOCS_EXT = DOC_UPLOAD_DEFAULT_EXTENSIONS;

// async function handleImageFileResizing(req, imageSize) {
//     if (req.files && req.files.length > 0) {
//         req.files = await ImageProcessingUtils.resizeImages(req.files, imageSize);
//     }
// }

module.exports = opts => async (req, res, next) => {
    try {
        const size = opts.size || 500 * 1024; // required size limit or 500k as default
        const fields = [];
        // Get fields
        for (let i = 0; i < opts.fields.length; i += 1) {
            fields.push({
                name: opts.fields[i].name,
                maxCount: opts.fields[i].count || Infinity,
                ext: opts.fields[i].ext,
            });
        }

        const getFieldByName = (name) => {
            for (let i = 0; i < fields.length; i += 1) {
                if (fields[i].name === name) {
                    return fields[i];
                }
            }
            return undefined;
        };

        const mInstance = multer({
            storage: multer.memoryStorage(),
            limits: {
                fileSize: size,
            },
            fileFilter: (req, file, callback) => {
                const fieldName = file.fieldname;
                const fileName = _.toLower(file.originalname);
                const field = getFieldByName(fieldName);
                const extensions = [];

                if (!_.isNil(field) && !_.isNil(field.ext)) {
                    const ext = field.ext;

                    switch (ext) {
                        case ALLOWED_FILE_TYPES.IMAGES:
                            extensions.push(...IMAGES_EXT);
                            break;
                        case ALLOWED_FILE_TYPES.DOCS:
                            extensions.push(...DOCS_EXT);
                            break;
                        case ALLOWED_FILE_TYPES.IMAGES_DOCS:
                            extensions.push(...DOCS_EXT);
                            extensions.push(...IMAGES_EXT);
                            break;
                        default:
                            callback(new ValidationError(23, 'Invalid File Extension'));
                            break;
                    }
                    const fileParts = fileName.split('.');
                    const fileExt = fileParts[fileParts.length - 1].trim();
                    // Check extensions
                    for (let i = 0; i < extensions.length; i += 1) {
                        const ext = extensions[i];
                        if (_.eq(ext, fileExt)) {
                            return callback(null, true);
                        }
                    }

                    return callback(new ValidationError(23, 'Invalid File Extension'));
                }

                return callback(null, true);
            },
        });

        // const upload = mInstance.array(field, count);
        const upload = mInstance.fields(fields);
        await new Promise((resolve, reject) => {
            upload(req, res, async (e) => {
                const error = new ValidationError();
                if (e) {
                    switch (e.code) {
                        case 'LIMIT_UNEXPECTED_FILE':
                            let count = 1;
                            const field = getFieldByName(e.field);
                            if (field) {
                                count = field.maxCount;
                            }
                            error.message = `Files count must be less than or equal to ${count}`;
                            break;
                        case 'LIMIT_FILE_SIZE':
                            error.message = `File size must be less than or equal to ${size} bytes`;
                            break;
                        case 23:
                            error.message = e.message;
                            break;
                        default:
                            error.message = 'Error while uploading files';
                    }

                    reject(error);
                }

                resolve();
            });
        });
        next();
    } catch (err) {
        next(err);
    }
};
