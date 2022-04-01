import React from "react";
import { FeedbackCollection } from "../../api/modules";
import { useTracker } from "meteor/react-meteor-data";
import { FeedbackMessage } from "./FeedbackMessage";
import { rateFeedback } from "../../api/methods/rateFeedback";

export const Feedback = ({ feedback, beginFocus, endFocus }) => {
  const user = useTracker(() => Meteor.user());

  const markHelpful = (id) => {
    rateFeedback.call({
      feedbackID: id,
      rating: true,
      createdAt: new Date(),
    })
  }

  return (
    <div className="feedbackContainer">

      <h3>{"Feedback"}</h3>

      <div className="allFeedback">

        {
          feedback.map((feedback) => (

            <div onMouseEnter={beginFocus(feedback._id)} onMouseLeave={endFocus(feedback._id)} key={feedback._id}>

              <FeedbackMessage
                isHelpful={() => { markHelpful(feedback._id) }}
                beginFocus={beginFocus(feedback._id)}
                endFocus={endFocus(feedback._id)}
                comment={feedback.body}
              />

            </div>

          ))
        }

      </div>

    </div>
  );
};
