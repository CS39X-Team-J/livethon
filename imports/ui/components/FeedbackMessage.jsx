import React, { useContext } from "react";
import { FeedbackCollection } from "../../api/modules";
import { useTracker } from "meteor/react-meteor-data";

export const FeedbackMessage = ({ comment, isHelpful }) => {

  return (
    <div className="feedback-message">
      <p>{comment}</p>

      <div className="feedback-reaction">
        <button onClick={isHelpful}>This helped me!</button>
      </div>
    </div>
  );
};