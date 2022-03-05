import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { ModulesCollection, RunsCollection } from '../modules';

export const createModule = {
    name: 'modules.create',

    // Factor out validation so that it can be run independently (1)
    validate(args) {
        new SimpleSchema({
            code: { type: String },
            createdAt: { type: Date },
            user: { type: String },
            session: { type: String },
        }).validate(args)
    },

    // Factor out Method body so that it can be called independently (3)
    run({ code, createdAt, user, session }) {

        if (user != this.userId) {
            throw new Meteor.Error('modules.create.unauthorized',
                'Cannot create module that is not yours');
        }

        ModulesCollection.insert({
            code,
            createdAt,
            user,
            session,
        });
    },

    // Call Method by referencing the JS object (4)
    // Also, this lets us specify Meteor.apply options once in
    // the Method implementation, rather than requiring the caller
    // to specify it at the call site.
    call(args, callback) {
        const options = {
            returnStubValue: true,     // (5)
            throwStubExceptions: true  // (6)
        }

        Meteor.apply(this.name, [args], options, callback);
    }
};

