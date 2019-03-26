'use strict';

const Joi = require('joi');
const Helpers = require('../helpers');
const SecretModel = require('../../models/Secret');

module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/secrets/{id}',
    options: {
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
