'use strict';

const Boom = require('boom');
const Toys = require('toys');
const Avocat = require('avocat');
const { NotFoundError, ValidationError } = require('objection');

const internals = {};

module.exports = Toys.onPreResponse((request, h) => {

    const { response: error } = request;
    const { mapError } = internals;

    if (!error.isBoom) {
        return h.continue;
    }

    throw mapError(error);
});

internals.mapError = (error) => {

    const { transformModelNames } = internals;

    // Handle some specific db errors

    if (error instanceof ValidationError) {
        return Boom.badData('Validation failed'); // No specifics, avoid leaking model details
    }

    if (error instanceof NotFoundError) {
        return Boom.notFound(`${(transformModelNames[error.modelName] || error.modelName) || 'Record'} Not Found`);
    }

    // Handle all other db errors with avocat

    return Avocat.rethrow(error, { return: true, includeMessage: false }) || error;
};

internals.transformModelNames = {
    'UserSecret': 'Secret'
};
