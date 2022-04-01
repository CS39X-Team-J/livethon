import { Meteor } from 'meteor/meteor';
import { SessionsCollection } from "../../imports/api/modules";

export const sessionsPublication = () => {
    
    Meteor.publish('sessions', function () {
        return SessionsCollection.find();
    });

}