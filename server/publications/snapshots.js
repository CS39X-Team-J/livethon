import { Meteor } from 'meteor/meteor';
import { SnapshotsCollection } from "../../imports/api/modules";

export const snapshotsPublication = () => {
    
    Meteor.publish('snapshots', function (session) {
        
        let query = { session };
        
        if (!Roles.userIsInRole(this.userId, 'instructor')) {
            query = { ...query, user: this.userId }; 
        }

        return SnapshotsCollection.find(query);

    });

}