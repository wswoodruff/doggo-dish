'use strict';

const Objection = require('objection');
const Joi = require('joi');
const Hoek = require('hoek');
const Helpers = require('../helpers');
const GroupSecretModel = require('../../models/GroupSecret');
const SecretModel = require('../../models/Secret');

module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/secrets/{name}',
    options: {
        description: 'Update an existing secret',
        tags: ['api'],
        validate: {
            payload: Joi.object({
                secret: Joi.any().required()
            })
        },
        auth: {
            strategy: 'api-user-jwt'
        }
    },
    handler: async (request, h) => {

        const { displayService, fileService, secretService } = request.services();

        const { secret } = request.payload;
        const { name } = request.params;

        Hoek.assert(secret.startsWith('-----BEGIN PGP MESSAGE-----'));

        const existingSecret = await secretService.getByName(name);

        // Let's replace it!
        await fileService.upload(secret, existingSecret.fileId);

        const file = await fileService.findById(existingSecret.fileId);

        return {
            results: await displayService.fileBasic(file)
        };
    }
});
