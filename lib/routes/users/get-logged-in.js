'use strict';

const Helpers = require('../helpers');

module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/user',
    options: {
        description: 'Get logged-in user',
        tags: ['api'],
        auth: {
            strategy: 'jwt'
        }
    },
    handler: async (request, h) => {

        const { userService, displayService } = request.services();
        const user = await userService.findUserById(request.auth.credentials.userId);

        return {
            results: await displayService.userBasic(user)
        };
    }
});
