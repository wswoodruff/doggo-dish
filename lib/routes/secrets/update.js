'use strict';

const Joi = require('joi');
const Helpers = require('../helpers');
const SecretModel = require('../../models/Secret');

module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/secrets',
    options: {},
    handler: async (request, h) => {

        return 'oooya';
    }
});
