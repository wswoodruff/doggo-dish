'use strict';

const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class Group extends Model {

    static get tableName() {

        return 'Groups';
    }

    static get joiSchema() {

        return Joi.object({
            // General
            id: Model.schema.numericId.required(),
            ownerId: Model.schema.numericId.required(),
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
