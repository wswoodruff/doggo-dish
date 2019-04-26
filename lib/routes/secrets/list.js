'use strict';

const Joi = require('joi');
const Helpers = require('../helpers');
const SecretModel = require('../../models/Secret');

module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/secrets/list/{userId}',
    options: {
        description: 'Get secrets for user',
        tags: ['api'],
        validate: {
            params: Joi.object({
                name: SecretModel.field('name')
            })
        },
        auth: {
            strategy: 'api-user-jwt'
        }
    },
    handler: async (request, h) => {

        const { secretService } = request.server.services();

        const { userId } = request.auth.credentials;
        const { name } = request.params;

        console.log('await secretService._assertUserAccess()', await secretService._assertUserAccess(userId, name));

        // const
        return 'ayooo';
    }
});
