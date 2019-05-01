'use strict';

const Joi = require('joi');
const Helpers = require('../helpers');
const SecretModel = require('../../models/Secret');

module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/secrets/list',
    options: {
        description: 'Get secrets for user',
        tags: ['api'],
        auth: {
            strategy: 'api-user-jwt'
        }
    },
    handler: async (request, h) => {

        const { secretService, displayService } = request.server.services();

        const { userId } = request.auth.credentials;

        const secrets = await secretService.listSecrets(userId);

        return {
            results: await displayService.secretBasic(secrets)
        };
    }
});
