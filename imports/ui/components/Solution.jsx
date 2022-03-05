import { FeedbackCollection, RunsCollection } from "../../api/modules";
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from "react";
import AceEditor from "react-ace";
import { useParams } from "react-router-dom";
import { createSnapshot, getSnapshotByStudentSessionDate } from "../services/CodeSnapshot";
import { ResultViewer } from "./ResultViewer";

export const Solution = ({ module }) => {
  const [feedback, setFeedback] = useState("");
  const [selection, setSelection] = useState(null);
  const params = useParams();

  const currentSnapshot = useTracker(() => {
    return getSnapshotByStudentSessionDate({
      user: module.user,
      session: params.session,
      date: module.createdAt,
    });
  });

  const run = useTracker(() => {
    return RunsCollection.findOne({ module: module._id }, { sort: { createdAt: -1 }});
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

        <ResultViewer module={module} />
      </div>
      <input onInput={(e) => setFeedback(e.target.value)} />
      <button onClick={submitFeedback}>Submit</button>
    </div>
  );
};
