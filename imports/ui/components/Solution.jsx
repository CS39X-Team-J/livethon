import { FeedbackCollection } from "../../api/modules";
import React, { useState, Fragment } from "react";
import { Module } from "./Module";

export const Solution = ({ module }) => {
  const [feedback, setFeedback] = useState("");

  const submitFeedback = () => {
    FeedbackCollection.insert({ body: feedback, module: module._id });
  };

  return (
    <Fragment key={module._id}>
      <Module module={module} title={module.user.username} />
      <form onSubmit={submitFeedback}>
        <input onInput={(e) => setFeedback(e.target.value)}></input>
        <button>Submit</button>
      </form>
    </Fragment>
  );
};
