import { FeedbackCollection, ModulesCollection, RunsCollection, SessionsCollection, SnapshotsCollection } from "../imports/api/modules";

export const initializeRules = () => {
    
    // prevent direct client-side database access
    // Meteor recommends to use Methods instead for security
    ModulesCollection.deny({
        insert() { return true; },
        update() { return true; },
        remove() { return true; },
    });

    SessionsCollection.deny({
        insert() { return true; },
        update() { return true; },
        remove() { return true; },
    });

    SnapshotsCollection.deny({
        insert() { return true; },
        update() { return true; },
        remove() { return true; },
    });

    FeedbackCollection.deny({
        insert() { return true; },
        update() { return true; },
        remove() { return true; },
    });

    RunsCollection.deny({
        insert() { return true; },
        update() { return true; },
        remove() { return true; },
    });

}