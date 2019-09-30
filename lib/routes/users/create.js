'use strict';

const Joi = require('joi');

const Helpers = require('../helpers');
const UserModel = require('../../models/User');

module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/users/create',
    options: {
        description: 'Create new user',
        tags: ['api', 'private'],
        validate: {
            payload: Joi.object({
                email: UserModel.field('email'),
                fingerprint: UserModel.field('fingerprint'),
                publicKey: UserModel.field('publicKey').required(),
                password: UserModel.field('password').required()
            })
                .or('email', 'fingerprint')
        },
        auth: false
    },
    handler: async (request, h) => {

        const { userService } = request.services();

        await userService.create(request.payload);

        return {
            results: 'Success'
        };
    }
});
