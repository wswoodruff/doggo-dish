'use strict';

const Joi = require('joi');
const Helpers = require('../helpers');
const UserModel = require('../../models/User');

const internals = {};

module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/users/{id}/request-reset',
    options: {
        description: 'Request password reset for a user',
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: UserModel.field('id')
            })
        },
        auth: false
    },
    handler: async (request) => {

        const { id } = request.params;
        const { userService } = request.services();

        await userService.createResetToken(id);

        return {
            results: 'Success'
        };
    }
});
