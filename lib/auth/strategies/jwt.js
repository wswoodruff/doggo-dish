'use strict';

const { constants: { JWT_ALGO } } = require('../../helpers');

const internals = {};

module.exports = (srv, options) => {

    return {
        name: 'api-user-jwt',
        scheme: 'jwt',
        options: {
            key: options.jwtKey,
            urlKey: false,
            cookieKey: false,
            tokenType: 'Token',
            verifyOptions: { algorithms: [JWT_ALGO] }, // pick a strong algorithm
            validate: internals.validate
        }
    };
};

internals.validate = async function (decoded, request) {

    const { Token } = request.models();

    const foundToken = await Token.query().findById(decoded.jti);

    if (foundToken) {
        // Allow default 'credentials' to be set
        return { isValid: true };
    }

    return { isValid: false };
};
