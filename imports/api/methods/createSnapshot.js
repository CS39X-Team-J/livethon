import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { SnapshotsCollection, SessionsCollection } from '../modules';
import { Roles } from 'meteor/alanning:roles';

export const createSnapshot = {
  name: 'snapshots.create',

  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      code: { type: String },
      session: { type: String },
      user: { type: String },
      createdAt: { type: Date },
    }).validate(args)
  },

  // Factor out Method body so that it can be called independently (3)
  run({ code, session, user, createdAt }) {
      
    if (SessionsCollection.find({ name: session }).fetch().length == 0) {
        throw new Meteor.Error('snapshots.create.session_not_found',
        'Referenced session is not found');
    }

    if (user != this.userId && !Roles.userIsInRole(this.userId, 'instructor')) {
      throw new Meteor.Error('run.create.unauthorized',
        'Cannot create snapshot that is not yours');
    }

    SnapshotsCollection.insert({
        code,
        session,
        user,
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


