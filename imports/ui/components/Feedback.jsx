import React, { useContext } from "react";
import { FeedbackCollection } from "../../api/modules";
import { useTracker } from "meteor/react-meteor-data";
import { SessionContext } from "../App";
import { FeedbackMessage } from "./FeedbackMessage";

export const Feedback = ({ module, beginFocus, endFocus }) => {
  const user = useTracker(() => Meteor.user());
  const { session, setSession } = useContext(SessionContext);

  const feedback = useTracker(() => {
    return FeedbackCollection.find({ module: module._id }).fetch();
  });

  const markHelpful = (id) => {
    FeedbackCollection.update({ _id: id }, { $set: { helpful: true }});
  }

  return (
    <div className="feedback-container">
      <h3>{"Feedback"}</h3>
      <div className="allFeedback">
        {feedback.map((feedback) => (
          <FeedbackMessage
            key={feedback._id}
            isHelpful={() => { markHelpful(feedback._id) }}
            beginFocus={beginFocus(feedback._id)}
            endFocus={endFocus(feedback._id)}
            comment={feedback.body}
          />          
        ))}
      </div>
    </div>
  );
};
