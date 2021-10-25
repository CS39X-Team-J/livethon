import { FeedbackCollection } from "../../api/modules";
import React, { useState, Fragment, useContext } from "react";
import { createSnapshot, getSnapshotsByStudentSession, Module } from "./Module";
import { SessionContext } from "../App";
import { getSnapshotByStudentSessionDate } from "./Module";

export const Solution = ({ module }) => {
  const [feedback, setFeedback] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selection, setSelection] = useState(null);
  const { session } = useContext(SessionContext);

  const submitFeedback = () => {
    // check if snapshot of current code exists,
    // if not, create it and reference it in feedback collection
    let snapshotID;
    
    const snap = getSnapshotByStudentSessionDate({ user: module.user, session, date: module.createdAt });
    console.log(snap)
    if (!snap) {
      snapshotID = createSnapshot({ module, code: module.code, date: module.createdAt });
    } else {
      console.log("success")
      snapshotID = snap._id;
    }

    FeedbackCollection.insert({ 
      body: feedback,
      module: module._id, 
      snapshot: snapshotID,
      region: selection.getAllRanges(), 
    });
  };

  return (
    <Fragment key={module._id}>
      <Module module={module} title={module.user.username} onSelectionChange={(newRegion) => { setSelection(newRegion) }} readonly={false} region={[]} />
      <input onInput={(e) => setFeedback(e.target.value)}/>
      <button onClick={submitFeedback}>Submit</button>
    </Fragment>
  );
};
