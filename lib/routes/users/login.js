'use strict';

const Joi = require('joi');
const Helpers = require('../helpers');
const UserModel = require('../../models/User');

const internals = {};

module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/login',
    options: {
        description: 'Log in',
        tags: ['api'],
        validate: {
            payload: Joi.object({
                email: UserModel.field('email'),
                fingerprint: UserModel.field('fingerprint'),
                password: Joi.string().required()
            })
                .or('email', 'fingerprint')
        },
        auth: false
    },
    handler: async (request, h) => {

        const { userService } = request.services();

        const loginAndCreateToken = async (txn) => {

            const user = await userService.login(request.payload, txn);
            return userService.createToken(user, txn);
        };

        return {
            results: await h.context.transaction(loginAndCreateToken)
        };
    }
});
