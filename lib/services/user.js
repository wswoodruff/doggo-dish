'use strict';

const Util = require('util');

const Schmervice = require('schmervice');
const Boom = require('boom');
const JWT = require('jsonwebtoken');
const SecurePassword = require('secure-password');
const Uuid = require('uuid');

const { constants: { JWT_ALGO } } = require('../helpers');

module.exports = class UserService extends Schmervice.Service {

    constructor(server, options) {

        super(server, options);

        // New instance of SecurePassword using the default config
        this.pwd = new SecurePassword();
    }

    async findUserById(id, txn) {

        const { User } = this.server.models();

        return await User.query(txn)
            .throwIfNotFound()
            .findById(id);
    }

    async create({ email, password }, txn) {

        const { User } = this.server.models();

        password = Buffer.from(password);
        const hash = await this.pwd.hash(password);

        return await User.query(txn)
            .insertAndFetch({
                email,
                password: hash
            });
    }

    async login({ email, password }, txn) {

        const { User } = this.server.models();

        const user = await User.query()
            .where({ email })
            .whereNotNull('password')
            .first();

        const errMsg = 'User or Password is invalid';

        if (!user) {
            throw Boom.unauthorized(errMsg);
        }

        password = Buffer.from(password);
        const hash = Buffer.from(user.password);

        const result = await this.pwd.verify(password, hash);

        // $lab:coverage:off$
        if (result === SecurePassword.INVALID ||
            result === SecurePassword.INVALID_UNRECOGNIZED_HASH) {
            // $lab:coverage:on$
            return Boom.unauthorized(errMsg);
        }

        // Testing this is more trouble than its worth for now
        // $lab:coverage:off$
        if (result === SecurePassword.VALID_NEEDS_REHASH) {
            const newHash = await this.pwd.hash(password);

            await Users.query()
                .where({ 'id': user.id })
                .patch({ 'password': newHash.toString('utf8') });
        }
        // $lab:coverage:on$

        return user;
    }

    async createToken(user, txn) {

        const { Token } = this.server.models();

        const newToken = await Token.query(txn).insertAndFetch({});
        await newToken.$relatedQuery('user', txn).relate(user);

        return JWT.sign(
            {
                jti: newToken.id,
                userId: user.id
            },
            this.options.jwtKey,
            { algorithm: JWT_ALGO } // NOTE must match the algo in api-user-jwt.js
        );
    }

    async logout(jti) {

        const { Token } = this.server.models();
        await Token.query().deleteById(jti);
    }

    async createResetToken(id, txn) {

        const { User } = this.server.models();

        const rawResetToken = Buffer.from(Uuid({ rng: Uuid.nodeRNG }));

        return await User.query(txn)
            .patch({
                resetToken: await this.pwd.hash(rawResetToken)
            })
            .where({ id })
            .throwIfNotFound()
            .first()
            .returning('*');
    }

    async resetPassword(email, resetToken, newPassword, txn) {

        const { User } = this.server.models();

        const user = await User.query(txn)
            .where({ email })
            .whereNotNull('resetToken')
            .throwIfNotFound()
            .first();

        const passedToken = Buffer.from(resetToken);
        const userToken = Buffer.from(user.resetToken);

        const result = await this.pwd.verify(passedToken, userToken);

        if (result !== SecurePassword.VALID &&
            result !== SecurePassword.VALID_NEEDS_REHASH) {

            throw Boom.unauthorized();
        }

        await User.query(txn)
            .patch({
                password: await this.pwd.hash(password),
                resetToken: null
            })
            .throwIfNotFound()
            .where({ id: user.id });
    }
};
