import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { TestsCollection } from '../modules';
import { Roles } from 'meteor/alanning:roles';
import { TestCaseData } from '../execute';

export const updateTestCase = {
    name: 'testcase.update',

    // Factor out validation so that it can be run independently (1)
    validate(args) {
        // new SimpleSchema({
        //     // testID: { type: String },
        //     // // test: { type: TestCaseData },
        //     // createdAt: { type: Date },
        // }).validate(args)
    },

    // Factor out Method body so that it can be called independently (3)
    run({ testID, test, createdAt }) {

        const testData = TestsCollection.findOne({ _id: testID });

        if (!testData) {
            throw new Meteor.Error('testcases.update.test_not_found',
                'Cannot update nonexistent test');
        }

        if (!Roles.userIsInRole(this.userId, 'instructor')) {
            throw new Meteor.Error('testcases.update.unauthorized',
                'Cannot update test with current permissions');
        }

        TestsCollection.update({ _id: testID }, {
            $set: {
                test,
                createdAt,
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


