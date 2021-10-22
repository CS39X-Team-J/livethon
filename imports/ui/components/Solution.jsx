import { FeedbackCollection } from "../../api/modules";
import React, { useState, Fragment } from "react";
import { Module } from "./Module";

const getStudentName = (id) => {
  const student = Meteor.users.find({ _id: id }).fetch()[0];
  return student?.username || "";
};

export const Solution = ({ user }) => {
  const [feedback, setFeedback] = useState("");

  const submitFeedback = () => {
    alert("submitted");
    FeedbackCollection.insert({ body: feedback, module: module._id });
  };

  return (
    <Fragment key={user._id}>
      <Module user={user} title={getStudentName(user._id)} />
      <form onSubmit={submitFeedback}>
        <input onInput={(e) => setFeedback(e.target.value)}></input>
        <button>Submit</button>
      </form>
    </Fragment>
  );
};
