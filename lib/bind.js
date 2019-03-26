'use strict';

const Objection = require('objection');
const Errors = require('./errors');

const internals = {};

module.exports = (server) => ({
    transaction: (fn) => {

        return Objection.transaction(server.knex(), (txn) => {

            // Patch-in some functionality so that we can react to the result of
            // a transaction without being the owner of that transaction.
            // See progress from knex at https://github.com/tgriesser/knex/issues/1521 and https://github.com/tgriesser/knex/issues/1641

            const { commit, rollback } = txn;

            txn.commit = async (...args) => {

                const result = await commit.call(txn, ...args);

                txn.emit('committed');

                return result;
            };

            txn.rollback = async (...args) => {

                const result = await rollback.call(txn, ...args);

                // 'error' events on EventEmitters are treated as special
                // cases within Node.js.

                // If an EventEmitter does not have at least one listener
                // registered for the 'error' event, and an 'error' event
                // is emitted, the error is thrown, a stack trace is printed,
                // and the Node.js process exits. =O =O =O =O !!!!!!!
                // See https://nodejs.org/api/events.html#events_error_events
                txn.once('error', internals.noop);
                txn.emit('error', new Errors.TransactionRollback());

                return result;
            };

            return fn(txn);
        });
    }
});

internals.noop = () => {};
