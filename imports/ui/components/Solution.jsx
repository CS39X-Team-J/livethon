import { SnapshotsCollection } from "../../api/modules";
import { useTracker } from 'meteor/react-meteor-data';
import React, { Fragment, useState } from "react";
import AceEditor from "react-ace";
import { useParams } from "react-router-dom";
import { ResultViewer } from "./ResultViewer";
import { createFeedback } from "../../api/methods/createFeedback";
import { createSnapshot } from "../../api/methods/createSnapshot";

export const Solution = ({ module }) => {
  const [feedback, setFeedback] = useState("");
  const [selection, setSelection] = useState(null);
  const params = useParams();

  const isReady = useTracker(() => {
    const subscription = Meteor.subscribe('snapshots', params.session);
    return subscription.ready();
  });

  const userData = useTracker(() => {
    Meteor.subscribe('userData');
    return Meteor.users.findOne({ _id: module.user });
  });

  const sendFeedback = ({ snapshotID, createdAt }) => {
    createFeedback.call({
      moduleID: module._id,
      body: feedback,
      snapshotID,
      selectedRegions: selection ? selection.getAllRanges() : [],
      createdAt,
    });
  }

  // assumes snapshots subscription is ready (meaning queries will return undefined only if there is no match)
  const submitFeedback = () => {

    const createdAt = new Date();

    const query = {
      user: module.user,
      session: params.session,
      createdAt: module.createdAt,
    };

    let snapshotID = SnapshotsCollection.findOne(query)?._id;

    // if snapshot doesn't exist, create snapshot, and on success, create feedback
    if (!snapshotID) {
      createSnapshot.call({
        code: module.code,
        session: params.session,
        user: module.user,
        createdAt: module.createdAt,
      }, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          snapshotID = SnapshotsCollection.findOne(query)._id;
          sendFeedback({ snapshotID, createdAt });
        }
      });
    } else {
      sendFeedback({ snapshotID, createdAt });
    }     

  };

  return (
    <div key={module._id}>
      {
        (isReady) ? (
          <Fragment>
            <div className="module-container">
              <h3>Student: {userData?.username}</h3>

              <AceEditor
                mode="python"
                theme="github"
                setOptions={{
                  useSoftTabs: true,
                }}
                highlightActiveLine={false}
                onSelectionChange={(newRegion) => {
                  setSelection(newRegion);
                }}
                height="400px"
                width="600px"
                debounceChangePeriod={1000}
                name={module._id}
                readOnly={true}
                editorProps={{ $blockScrolling: true }}
                value={module.code}
              />

              <ResultViewer moduleID={module._id} createdAt={module.createdAt} />
            </div>
            <input onInput={(e) => setFeedback(e.target.value)} />
            <button onClick={submitFeedback}>Submit</button>
          </Fragment>

        ) : ''
      }

    </div>
  );
};
