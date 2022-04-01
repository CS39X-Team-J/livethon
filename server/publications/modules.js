import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ModulesCollection } from "../../imports/api/modules";

export const modulesPublication = () => {
    
    Meteor.publish('modules', function (session) {
        
        let query = null;

        if (Roles.userIsInRole(this.userId, 'instructor')) {
            query = { session };    
        } else {
            query = { session, user: this.userId };
        }

        return ModulesCollection.find(query);

    });

}