import { SessionsCollection, ModulesCollection } from '../../api/modules';
import { useTracker } from 'meteor/react-meteor-data';

// checks if user
export const getStudentSession = ({ session, user }) => {
    // only insert into modules collection, since we don't need starter code in snapshot log
    ModulesCollection.insert({
        code: "# Type your solution here",
        createdAt: new Date(),
        user,
        session,
    });

    console.log("Marker!")
    console.log(`Finding ${session} session...`)
    console.log(SessionsCollection.find({ name: "Not A lab!!!!"}).fetch());

    // TODO
    // let sessionID = SessionsCollection.findOne({ name: session })._id;

    // if (!(getStudentsBySession({ session }).includes(user))) {
    //     SessionsCollection.update({ _id: sessionID }, {
    //         $addToSet: { users: user }
    //     });
    // }
}

// TODO: combine these functions into one and return an object with each property
export const getSession = ({ session }) => useTracker(() => {
    
});

export const getStudentsBySession = ({ session }) => {
    return SessionsCollection.findOne({ name: session }).users;
}

export const getCodeBySession = ({ session }) => {
    return ModulesCollection.find({ session }).fetch();
}

export const getCodeByStudentSession = ({ session, user }) => {
    return ModulesCollection.findOne({ session, user });
}