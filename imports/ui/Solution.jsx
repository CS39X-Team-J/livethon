import { FeedbackCollection } from "../api/modules";
import React, { useState, Fragment } from "react";
import { Module } from "./Module";

const getStudentName = (id) => {
  const student = Meteor.users.find({ _id: id }).fetch()[0];
  return student?.username || "";
};

export const Solution = ({ module }) => {
  const [feedback, setFeedback] = useState("");

  const submitFeedback = () => {
    alert("submitted");
    FeedbackCollection.insert({ body: feedback, module: module._id });
  };

  return (
    <Fragment key={module._id}>
      <Module module={module} title={getStudentName(module.user)} />
      <form onSubmit={submitFeedback}>
        <input onInput={(e) => setFeedback(e.target.value)}></input>
        <button>Submit</button>
      </form>
    </Fragment>
  );
};
