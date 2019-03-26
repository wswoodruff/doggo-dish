'use strict';

const Helpers = require('../helpers');
const UserModel = require('../../models/User');

module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/users/create',
    options: {
        description: 'Create new user',
        tags: ['api', 'private'],
        validate: {
            payload: {
                email: UserModel.field('email').required(),
                password: UserModel.field('password').required()
            }
        },
        auth: false
    },
    handler: async (request, h) => {

        const { userService, displayService } = request.services();

        const user = await userService.create(request.payload);

        return {
            results: await displayService.userBasic(user)
        };
    }
});
