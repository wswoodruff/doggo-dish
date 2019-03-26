'use strict';

const Joi = require('joi');
const Helpers = require('../helpers');
const SecretModel = require('../../models/Secret');

const { SECRET_MAX_FILE_SIZE } = require('../helpers/constants');

module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/secrets',
    options: {
        validate: {
            headers: Joi.object({
                'x-filename': Joi.string().required()
            }).unknown()
        },
        payload: {
            output: 'stream',
            parse: 'gunzip',
            maxBytes: SECRET_MAX_FILE_SIZE,
            multipart: false
        }
    },
    handler: async (request, h) => {

        const { displayService, fileService } = request.services();

        const fileId = await fileService.upload(
            request.payload,
            request.headers['x-filename']
        );

        const file = await fileService.findById(fileId);

        return {
            results: await displayService.fileBasic(file)
        };
    }
});
