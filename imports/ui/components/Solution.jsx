import { RunsCollection, SnapshotsCollection } from "../../api/modules";
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

  const currentSnapshot = useTracker(() => {
    const subscription = Meteor.subscribe('snapshots');
    return {
      snapshotID: SnapshotsCollection.findOne({
        user: module.user,
        session: params.session,
        createdAt: module.createdAt,
      })?._id,
      isReady: subscription.ready()
    }
  });

  const submitFeedback = () => {
    // check if snapshot of current code exists,
    // if not, create it and reference it in feedback collection

    if (!currentSnapshot.snapshotID) {
      createSnapshot.call({
        code: module.code,
        session: params.session,
        user: module.user,
        createdAt: module.createdAt,
      }, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully created snapshot")
        }
      });
    } 

    const snapshotID = SnapshotsCollection.findOne({ 
      session: params.session,
      user: module.user,
      createdAt: module.createdAt,
    })._id;
    
    createFeedback.call({
      moduleID: module._id,
      body: feedback,
      snapshotID,
      selectedRegions: selection ? selection.getAllRanges() : {},
    });

  };

  return (
    <div key={module._id}>
      {
        (currentSnapshot.isReady) ? (
          <Fragment>
            <div className="module-container">
              <h3>{module?.user?.username}</h3>

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
