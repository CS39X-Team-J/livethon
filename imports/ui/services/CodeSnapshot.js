import { SnapshotsCollection } from "../../api/modules";

const MIN_SNAPSHOT_DELAY = 10;

export const createSnapshot = ({ module, code, output, date }) => {
    return SnapshotsCollection.insert({
        code,
        output,
        createdAt: date,
        session: module.session,
        user: module.user,
    });
}

export const getSnapshotsByStudentSession = ({ session, user }) => {
    return SnapshotsCollection.find({ session, user }, { sort: { createdAt: -1 } }).fetch();
}

export const getSnapshotByStudentSessionDate = ({ session, user, date }) => {
    return SnapshotsCollection.findOne({ session, user, createdAt: date });
}

export const compile = async (module, code, request) => {
    try {
        const results = await request({ id: module._id, code });
        return results.error ? results.error.error : results.stdout;
    } catch (e) {
        return e;
    }
}

// called on every change in code and will create a snapshot if enough time has elapsed
// since last snapshot
export const logSnapshot = (module, time, currentSnapshot, output) => {
    const lastSnapshotDate = SnapshotsCollection.findOne({ user: module.user, session: module.session }, { sort: { createdAt: -1 } })?.createdAt;
    if ((time.getTime() - (lastSnapshotDate ? lastSnapshotDate.getTime() : 0)) > MIN_SNAPSHOT_DELAY) {
        createSnapshot({ module, code: currentSnapshot, output, date: time });
    }
}