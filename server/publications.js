import { feedbackPublication } from './publications/feedback';
import { modulesPublication } from './publications/modules';
import { runsPublication } from './publications/runs';
import { sessionsPublication } from './publications/sessions';
import { snapshotsPublication } from './publications/snapshots';
import { userPublication } from './publications/user';

export const initializePublications = () => {
    feedbackPublication();
    modulesPublication();
    runsPublication();
    sessionsPublication();
    snapshotsPublication();
    userPublication();
}