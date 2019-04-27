'use strict';

const Joi = require('joi');
const Helpers = require('../helpers');

module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/secrets',
    options: {
        description: 'Create new secret',
        tags: ['api'],
        validate: {
            payload: {
                secret: Joi.string().required(),
                name: Joi.string().required(),
                groupId: Joi.number()
            }
        }
    },
    handler: async (request, h) => {

        const { displayService, fileService } = request.services();

        const { secret, name } = request.payload;

        const fileId = await fileService.upload(secret,name);

        const file = await fileService.findById(fileId);

        return {
            results: await displayService.fileBasic(file)
        };
    }
});
