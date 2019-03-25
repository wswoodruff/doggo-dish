'use strict';

const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class User extends Model {

    static get tableName() {

        return 'Users';
    }

    static get joiSchema() {

        return Joi.object({
            // General
            id: Model.schema.numericId,
            email: Joi.string().email().required(),
            password: Joi.string(),
            resetToken: Joi.binary().allow(null),

            // Timestamps
            createdAt: Model.schema.timestamp,
            updatedAt: Model.schema.timestamp,
            lastLoginAt: Model.schema.timestamp
        });
    }

    $beforeInsert() {

        this.createdAt = this.updatedAt = new Date().toISOString();
    }

    $beforeUpdate() {

        this.updatedAt = new Date().toISOString();
    }
};
