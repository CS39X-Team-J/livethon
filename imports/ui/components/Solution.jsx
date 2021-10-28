import { FeedbackCollection } from "../../api/modules";
import { ResultViewer } from "./Module";
import React, { useState, useContext } from "react";
import { SessionContext } from "../App";
import { getSnapshotByStudentSessionDate } from "./Module";
import AceEditor from "react-ace";
export const Solution = ({ module }) => {
  const [feedback, setFeedback] = useState("");
  const [selection, setSelection] = useState(null);

  const { session } = useContext(SessionContext);

  const snap = getSnapshotByStudentSessionDate({
    user: module.user,
    session,
    date: module.createdAt,
  });

  const submitFeedback = () => {
    // check if snapshot of current code exists,
    // if not, create it and reference it in feedback collection
    let snapshotID;

    snapshotID = snap?._id;

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
        <h3>{module.user.username}</h3>

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
