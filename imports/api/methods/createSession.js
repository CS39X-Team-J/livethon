import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { SessionsCollection } from '../modules';    
import { Roles } from 'meteor/alanning:roles';

export const createSession = {
    name: 'session.create',

    // Factor out validation so that it can be run independently (1)
    validate(args) {
        new SimpleSchema({
            name: { type: String },
            title: { type: String },
            description: { type: String },
            template: { type: String },
            createdAt: { type: Date },
        }).validate(args)
    },

    // Factor out Method body so that it can be called independently (3)
    run({ name, title, description, template, createdAt }) {
        
        if (!Roles.userIsInRole(this.userId, 'instructor')) {
            throw new Meteor.Error('session.create.unauthorized',
                'Only users with role instructor can create sessions');
        }

        if (SessionsCollection.find({ name }).fetch().length > 0) {
            throw new Meteor.Error('session.create.duplicate',
                'Session name already taken');
        }

        SessionsCollection.insert({
            name: name,
            instructions: {
                title,
                description,
            },
            template,
            users: [],
            createdAt,
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


