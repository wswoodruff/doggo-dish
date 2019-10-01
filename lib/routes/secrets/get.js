'use strict';

const Joi = require('joi');
const Helpers = require('../helpers');
const SecretModel = require('../../models/Secret');

module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/secrets/{name}',
    options: {
        description: 'Get secret by name',
        tags: ['api'],
        validate: {
            params: Joi.object({
                name: SecretModel.field('name').required()
            })
        },
        auth: {
            strategy: 'api-user-jwt'
        }
    },
    handler: async (request, h) => {

        const { awsService, secretService } = request.server.services();

        const { userId } = request.auth.credentials;
        const { name } = request.params;

        await secretService._assertUserAccess(userId, { name });

        const secret = await secretService.getByName(name);

        // Next, need to fetch the secret here from S3
        // and send down the secret instead of this DB stuff

        const { Body } = await awsService.download(secret.fileId);

        return Body;
    }
});
