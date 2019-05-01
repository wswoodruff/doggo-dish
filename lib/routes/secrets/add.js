'use strict';

const Objection = require('objection');
const Joi = require('joi');
const Bounce = require('bounce');
const Hoek = require('hoek');
const Helpers = require('../helpers');
const GroupSecretModel = require('../../models/GroupSecret');
const SecretModel = require('../../models/Secret');

module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/secrets',
    options: {
        description: 'Create a new secret',
        tags: ['api'],
        validate: {
            payload: Joi.object({
                secret: Joi.any().required(),
                name: Joi.string().required(),
                groupId: GroupSecretModel.field('groupId'),
                accessRoles: GroupSecretModel.field('accessRoles'),
                type: Joi.string().valid(SecretModel.TYPES).required()
            })
        },
        auth: {
            strategy: 'api-user-jwt'
        }
    },
    handler: async (request, h) => {

        const { displayService, fileService, secretService } = request.services();

        const { secret, name, groupId, type } = request.payload;

        Hoek.assert(secret.startsWith('-----BEGIN PGP MESSAGE-----'));

        const { userId } = request.auth.credentials;

        const fileId = await fileService.upload(secret);
        await fileService.insertWithMetadata(fileId);

        const { id: secretId } = await secretService.create({ fileId, name, type });

        // Grant user access
        await secretService.grantUserAccess(secretId, userId);

        const file = await fileService.findById(fileId);

        return {
            results: await displayService.fileBasic(file)
        };
    }
});
