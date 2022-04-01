import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FeedbackCollection, ModulesCollection } from "../../imports/api/modules";

export const feedbackPublication = () => {
    
    Meteor.publish('feedback', function (session) {

        if (Roles.userIsInRole(this.userId, 'instructor')) {
            // instructors can see feedback for all sessions
            const modules = ModulesCollection.find({ session });
            return FeedbackCollection.find({ module: { $in: modules.map(m => m._id) }});
        } else {
            // students can only view feedback addressed to them
            const module = ModulesCollection.findOne({ session, user: this.userId });
            if (!module) {
                return this.ready();
            } else {
                return FeedbackCollection.find({ module: module._id });
            }
        }       

    });

}