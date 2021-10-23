import React, { useContext } from "react";
import { FeedbackCollection } from "../../api/modules";
import { useTracker } from "meteor/react-meteor-data";
import { SessionContext } from "../App";

export const Feedback = ({ module }) => {
  const user = useTracker(() => Meteor.user());
  const { session, setSession } = useContext(SessionContext);

  const feedback = useTracker(() => {
    return FeedbackCollection.find({ user, session }).fetch();
  });

  return (
    <div className="feedback-container">
      <h3>{"Feedback service"}</h3>
      <div className="allFeedback">
        {feedback.map((feedback) => (
          <div className="feedback" key={feedback._id}>
            <b>{feedback.body}</b>
          </div>
        ))}
      </div>
    </div>
  );
};
