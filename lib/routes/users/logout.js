'use strict';

const Helpers = require('../helpers');

module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/logout',
    options: {
        description: 'Log user out',
        tags: ['api', 'private'],
        auth: {
            strategy: 'jwt'
        }
    },
    handler: async (request, h) => {

        const { userService } = request.services();

        await userService.logout(request.auth.credentials.jti);

        return {
            results: 'Success'
        };
    }
});
