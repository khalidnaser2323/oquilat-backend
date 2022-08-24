/**
 * Socket.io authentication middleware
 */
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('../config');

const {
    UnauthorizedError,
} = require('../helpers/errors');

const authenticate = (socket, next) => {
    const {User} = require('../db/models');
    const mSocket = socket;
    const token = mSocket.handshake.query.authorization;

    if (_.isNil(token)) {
        socket.disconnect();
        return (new UnauthorizedError());
    }

    jwt.verify(token, config.auth.local.key, async (err, decoded) => {
        if (err || decoded === undefined || _.isNil(decoded)) {
            socket.disconnect();
            return next(new UnauthorizedError());
        }

        const user = await User.getById(decoded.sub, {lean: false});
        // const user = decoded;
        // if (_.isNil(user.roles)) {
        //     user.roles = ['user'];
        // }

        mSocket.request.user = user;
        return next();
    });
};

module.exports = {
    authenticate,
};
