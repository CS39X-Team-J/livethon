import React, { useContext } from "react";
import { FeedbackCollection } from "../../api/modules";
import { useTracker } from "meteor/react-meteor-data";

export const FeedbackMessage = ({ comment, isHelpful, beginFocus, endFocus }) => {

  return (
    <div className="feedback-message" onMouseEnter={beginFocus} onMouseLeave={endFocus}>
      {comment}
      <button onClick={isHelpful}>This helped me!</button>
    </div>
  );
};