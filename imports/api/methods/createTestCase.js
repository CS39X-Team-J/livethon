import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { SessionsCollection, TestsCollection } from '../modules';
import { Roles } from 'meteor/alanning:roles';

export class TestCase {
    
    constructor(targetFunction, input, expectedOutput) {
        this._targetFunction = targetFunction;
        this._input = input;
        this._expectedOutput = expectedOutput;
    }

    get targetFunction() {
        return this._targetFunction;
    }

    get input() {
        return this._input;
    }

    get expectedOutput() {
        return this._expectedOutput;
    }

}

export const createTestCase = {
  name: 'testcase.create',

  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      test: { type: TestCase },
      session: { type: String },
      createdAt: { type: Date },
    }).validate(args)
  },

  // Factor out Method body so that it can be called independently (3)
  run({ test, session, createdAt }) {
    
    const sessionID = SessionsCollection.find({ name: session })?._id;

    if (!sessionID) {
        throw new Meteor.Error('testcases.create.session_not_found',
        'Referenced session is not found');
    }

    if (!Roles.userIsInRole(this.userId, 'instructor')) {
      throw new Meteor.Error('testcases.create.unauthorized',
        'Cannot create test with current permissions');
    }

    TestsCollection.insert({ 
        session: sessionID,
        test,
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

