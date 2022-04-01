import { Meteor } from 'meteor/meteor';
import { TestsCollection } from "../../imports/api/modules";

export const testsPublication = () => {
    
    Meteor.publish('tests', function (session) {
        
        let query = { session };

        return TestsCollection.find(query);

    });

    Meteor.publish('test-results', function (run) {

    });

}