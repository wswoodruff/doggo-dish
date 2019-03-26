'use strict';

const Joi = require('joi');
const Helpers = require('../helpers');
const SecretModel = require('../../models/Secret');

module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/secrets/{id}',
    options: {
        description: 'Get secret by id',
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: SecretModel.field('id')
            })
        }
    },
    handler: async (request, h) => {

        return 'ayooo';
    }
});
