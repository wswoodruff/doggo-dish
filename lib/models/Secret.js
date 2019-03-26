'use strict';

const Joi = require('joi');
const { Model } = require('./helpers');
const FileModel = require('./File');

module.exports = class Secret extends Model {

    static get tableName() {

        return 'Secrets';
    }

    static get joiSchema() {

        return Joi.object({
            // General
            id: Model.schema.numericId,
            fileId: FileModel.field('id'),
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
