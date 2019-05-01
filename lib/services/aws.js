'use strict';

const Hoek = require('hoek');
const AWS = require('aws-sdk');
const Schmervice = require('schmervice');

module.exports = class AwsService extends Schmervice.Service {

    constructor(server, options) {

        super(server, options);

        const {
            region,
            accessKeyId,
            secretAccessKey,
            s3bucket
        } = options.aws || {};

        Hoek.assert(region, 'Must specify options.aws.region');
        Hoek.assert(accessKeyId, 'Must specify options.aws.accessKeyId');
        Hoek.assert(secretAccessKey, 'Must specify options.aws.secretAccessKey');
        Hoek.assert(s3bucket, 'Must specify options.aws.s3bucket');

        this.s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            region,
            accessKeyId,
            secretAccessKey
        });

        this.s3bucket = s3bucket;
    }

    async upload(key, body) {

        // See the docs on the difference between 'upload' and 'putObject'
        // 'upload' allows us to stream our 'Body' without worrying about the
        // total size. 'putObject' requires us to specify the total body size
        return await this.s3.upload({
            Key: key,
            Bucket: this.s3bucket,
            Body: body
        }).promise();
    }

    async download(key) {

        return await this.s3.getObject({
            Key: key,
            Bucket: this.s3bucket
        }).promise();
    }

    async getMetadata(objectId) {

        return await this.s3.headObject({
            Key: objectId,
            Bucket: this.s3bucket
        }).promise();
    }

    async deleteById(objectId) {

        return await this.s3.deleteObject({
            Key: objectId,
            Bucket: this.s3bucket
        }).promise();
    }

    // NOTE these default to expire in 15 minutes
    getSignedUrl(objectId) {

        return this.s3.getSignedUrl('getObject', {
            Key: objectId,
            Bucket: this.s3bucket
        });
    }
};
