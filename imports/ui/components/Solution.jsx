import { FeedbackCollection, RunsCollection } from "../../api/modules";
import { useTracker } from 'meteor/react-meteor-data';
import { ResultViewer } from "./Module";
import React, { useState, useContext } from "react";
import { SessionContext } from "../App";
import { getSnapshotByStudentSessionDate, createSnapshot } from "./Module";
import AceEditor from "react-ace";

export const Solution = ({ module }) => {
  const [feedback, setFeedback] = useState("");
  const [selection, setSelection] = useState(null);
  const { session } = useContext(SessionContext);

  const currentSnapshot = useTracker(() => {
    return getSnapshotByStudentSessionDate({
      user: module.user,
      session,
      date: module.createdAt,
    });
  });

  const run = useTracker(() => {
    return RunsCollection.findOne({ module: module._id }, { sort: {createdAt: -1}});
  });

  const submitFeedback = () => {
    // check if snapshot of current code exists,
    // if not, create it and reference it in feedback collection
    let snapshotID = currentSnapshot?._id;
    if (!currentSnapshot) {
      snapshotID = createSnapshot({ 
        module, 
        code: module.code,
        date: module.createdAt,
      })
    }

    console.log()

    FeedbackCollection.insert({
      body: feedback,
      module: module._id,
      snapshot: snapshotID,
      region: selection ? selection.getAllRanges() : [],
    });

  };

  return (
    <div key={module._id}>
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

        <ResultViewer className="cool" module_id={module._id} />
      </div>
      <input onInput={(e) => setFeedback(e.target.value)} />
      <button onClick={submitFeedback}>Submit</button>
    </div>
  );
};
