import React from "react";

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