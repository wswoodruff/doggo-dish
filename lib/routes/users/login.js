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
            payload: {
                email: UserModel.field('email').required(),
                password: Joi.string().required()
            }
        },
        auth: false
    },
    handler: async (request, h) => {

        const { userService } = request.services();
        const { email, password } = request.payload;

        const loginAndCreateToken = async (txn) => {

            const user = await userService.login({ email, password }, txn);
            return userService.createToken(user, txn);
        };

        return {
            results: await h.context.transaction(loginAndCreateToken)
        };
    }
});
