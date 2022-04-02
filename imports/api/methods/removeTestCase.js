import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { TestsCollection } from '../modules';
import { Roles } from 'meteor/alanning:roles';

export const removeTestCase = {
  name: 'testcase.delete',

  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      testID: { type: String },
    }).validate(args)
  },

  // Factor out Method body so that it can be called independently (3)
  run({ testID }) {
    
    const testData = TestsCollection.findOne({ _id: testID });

    if (!testData) {
        throw new Meteor.Error('testcases.delete.test_not_found',
        'Test not found');
    }

    if (!Roles.userIsInRole(this.userId, 'instructor')) {
      throw new Meteor.Error('testcases.create.unauthorized',
        'Cannot delete test with current permissions');
    }

    TestsCollection.remove({ _id: testID });

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


