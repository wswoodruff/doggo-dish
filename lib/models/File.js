'use strict';

const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class File extends Model {

    static get tableName() {

        return 'Files';
    }

    static get joiSchema() {

        return Joi.object({
            // General
            id: Model.schema.uuid.required(),
            name: Joi.string().allow(null),
            etag: Joi.string().allow(null),
            size: Joi.number().integer().allow(null),
            extension: Joi.string().allow(null),
            // Timestamps
            createdAt: Model.schema.timestamp,
            updatedAt: Model.schema.timestamp
        });
    }

    $beforeInsert() {

        this.createdAt = this.updatedAt = new Date().toISOString();
    }

    $beforeUpdate() {

        this.updatedAt = new Date().toISOString();
    }
};
