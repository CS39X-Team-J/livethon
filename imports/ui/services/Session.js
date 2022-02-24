import { useTracker } from 'meteor/react-meteor-data';
import { SessionsCollection, ModulesCollection } from '../../api/modules';


export const addStudentToSession = ({ session, user }) => {
    // only insert into modules collection, since we don't need starter code in snapshot log
    ModulesCollection.insert({
        code: "# Type your solution here",
        createdAt: new Date(),
        user,
        session,
    });

    let sessionID = SessionsCollection.findOne({ name: session })._id;

    if (!(getStudentsBySession({ session }).includes(user))) {
        SessionsCollection.update({ _id: sessionID }, {
            $addToSet: { users: user }
        });
    }
}

// TODO: combine these functions into one and return an object with each property
export const getSession = ({ session }) => {
    return useTracker(() => { return SessionsCollection.findOne({ name: session }); });
}

export const getStudentsBySession = ({ session }) => {
    return useTracker(() => { return SessionsCollection.findOne({ name: session }).users; });
}

export const getCodeBySession = ({ session }) => {
    return useTracker(() => { return ModulesCollection.find({ session }).fetch() });
}

export const getCodeByStudentSession = ({ session, user }) => {
    return useTracker(() => { return ModulesCollection.findOne({ session, user }); });
}