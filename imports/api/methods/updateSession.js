import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { SessionsCollection } from '../modules';
import { Roles } from 'meteor/alanning:roles';

export const updateSession = {
    name: 'session.update',

    // Factor out validation so that it can be run independently (1)
    validate(args) {
        new SimpleSchema({
            name: { type: String },
            title: { type: String },
            description: { type: String },
            template: { type: String },
        }).validate(args)
    },

    // Factor out Method body so that it can be called independently (3)
    run({ name, title, description, template }) {

        if (!Roles.userIsInRole(this.userId, 'instructor')) {
            throw new Meteor.Error('session.update.unauthorized',
                'Only users with role instructor can update sessions');
        }

        SessionsCollection.update({ name: name }, {
            $set: {
                instructions: {
                    title,
                    description,
                },
                template,
            }
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


