import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { SessionsCollection } from '../modules';


export const addSessionUser = {
  name: 'session.adduser',

  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      session: { type: String },
      user: { type: String },
    }).validate(args)
  },

  // Factor out Method body so that it can be called independently (3)
  run({ session, user, createdAt }) {
    const sessionData = SessionsCollection.findOne({ name: session });

    if (!sessionData) {
        throw new Meteor.Error('session.adduser.session_not_found',
        'Cannot give join non-existent session');
    }

    if (this.userId != user) {
        throw new Meteor.Error('session.adduser.unauthorized', 
        'Cannot add user besides yourself to session');
    }

    if (sessionData.users.includes(user)) {
        throw new Meteor.Error('session.adduser.duplicate', 
        'User already member of session');
    }

    SessionsCollection.update({ name: session }, { 
        $addToSet: { users: user }
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


