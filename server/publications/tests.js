import { Meteor } from 'meteor/meteor';
import { TestResultsCollection, TestsCollection } from "../../imports/api/modules";

export const testsPublication = () => {
    
    Meteor.publish('tests', function (session) {
        
        let query = { session };

        return TestsCollection.find(query);

    });

    Meteor.publish('test-results', function (run, test) {
        return TestResultsCollection.find({ runID: run, testID: test });
    });

}