import { Meteor } from 'meteor/meteor';

export const userPublication = () => {
    
    Meteor.publish('userData', function () {
        
        return Meteor.users.find({}, {
            fields: { username: 1, createdAt: 1, _id: 1 }
        });

    });

}