import { Meteor } from 'meteor/meteor';
import React, { useState, useContext } from "react";
import { Module, addStudentToSession, getCodeByStudentSession, getSession } from "../../components/Module.jsx";
import { Feedback } from "../../components/Feedback.jsx";
import { useTracker } from 'meteor/react-meteor-data';
import { SessionContext } from '../../App.jsx';
import { SnapshotsCollection, FeedbackCollection } from '../../../api/modules.js';

export const StudentView = () => {
  const user = useTracker(() => Meteor.user());
  const { session } = useContext(SessionContext);
  const sessionData = useTracker(() => getSession({ session }));
  const [currentFocus, setFocus] = useState("CURRENT");

  const module = useTracker(() => {
    const code = getCodeByStudentSession({ session, user });
    if (!code) {
      addStudentToSession({ session, user });
    }
    return getCodeByStudentSession({ session, user });
  });

  const focusFeedback = (id) => () => {
    const feedback = FeedbackCollection.findOne({ _id: id });
    setFocus({
      // prevent crashing when snapshot not found
      snapshot: SnapshotsCollection.findOne({ _id: feedback.snapshot}) || {},
      feedback,
    });
  }

  const endFocusFeedback = (id) => () => {
    setFocus("CURRENT");
  }

  return (
    
    <div className="studentModule">
        <div>
          <h1>{sessionData.name}</h1>
          <p>{sessionData.instructions.description}</p>
          <Module module={currentFocus == "CURRENT" ? module : currentFocus.snapshot } readonly={currentFocus != "CURRENT"} region={currentFocus != "CURRENT" ? currentFocus.feedback.region : []}/>
        </div>

        <Feedback module={module} beginFocus={focusFeedback} endFocus={endFocusFeedback}/>
    </div>
  );
};
