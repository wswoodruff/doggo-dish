'use strict';

const Toys = require('toys');
const Joi = require('joi');

const internals = {};

exports.withDefaults = (route) => {

    if (route.options.auth) {
        route = internals.withJwtHeaders(route);
    }

    return internals.withDefaults(route);
};

internals.withDefaults = Toys.withRouteDefaults({
    options: {
        validate: {
            failAction: (request, h, err) => {

                throw err;
            }
        }
    }
});

internals.withJwtHeaders = Toys.withRouteDefaults({
    options: {
        validate: {
            headers: Joi.object({
                authorization: Joi.string().description('JWT')
            }).unknown()
        }
    }
});
