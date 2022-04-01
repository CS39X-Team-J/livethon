import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ModulesCollection, RunsCollection } from "../../imports/api/modules";

export const runsPublication = () => {
    
    Meteor.publish('runs', function (session) {

        let query = null;

        if (Roles.userIsInRole(this.userId, 'instructor')) {
            query = { session };
        } else {
            query = { session, user: this.userId };
        }
    
        const modules = ModulesCollection.find(query);

        return RunsCollection.find({ module: { $in: modules.map(module => module._id) } });

    });

}