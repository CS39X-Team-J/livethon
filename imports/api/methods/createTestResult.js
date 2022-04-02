import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { RunsCollection, TestResultsCollection, TestsCollection } from '../modules';

export const createTestResult = {
  name: 'testresult.create',

  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      testID: { type: String },
      runID: { type: String },
      passed: { type: Boolean },
      output: { type: String, optional: true },
      createdAt: { type: Date },
    }).validate(args)
  },

  // Factor out Method body so that it can be called independently (3)
  run({ testID, runID, passed, output, createdAt }) {
    
    const test = TestsCollection.findOne({ _id: testID });
    const run = RunsCollection.findOne({ _id: runID });

    if (!test) {
        throw new Meteor.Error('testresult.create.test_not_found',
            'Referenced test is not found');
    }

    if (!run) {
        throw new Meteor.Error('testresult.create.run_not_found',
            'Referenced run is not found');
    }

    TestResultsCollection.insert({
        testID,
        runID,
        passed,
        output,
        createdAt,
    })

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


