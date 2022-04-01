import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FeedbackCollection, ModulesCollection } from "../../imports/api/modules";

// https://guide.meteor.com/data-loading.html#publishing-relations
// this package lets us use intermediate queries in a reactive way
export const feedbackPublication = () => {
    
    Meteor.publishComposite('feedback', function (session) {

        return {

            find() {

                let modulesQuery = { session };

                // if user is not instructor, return only feedback addressed to user
                if (!Roles.userIsInRole(this.userId, 'instructor')) {
                    modulesQuery = { ...modulesQuery, user: this.userId };
                }  

                const options = {
                    fields: { _id: 1 }
                }

                return ModulesCollection.find(modulesQuery, options);

            },

            children: [{
                find(module) {
                    console.log(module)
                    return FeedbackCollection.find({ module: module._id });
                }
            }]

        }    

    });

}