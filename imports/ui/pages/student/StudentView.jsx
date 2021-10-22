import { Meteor } from 'meteor/meteor';
import React, { useState, Fragment, useEffect } from "react";
import { getModules, Module } from "../../components/Module.jsx";
import { Feedback } from "../../components/Feedback.jsx";
import { useTracker } from 'meteor/react-meteor-data';

export const StudentView = () => {
  const user = useTracker(() => Meteor.user());

  const [module, setModule] = useTracker(() => {
    return getModules(user);
  });

  return (
    <div className="studentModule">
      <Fragment>
        <Module user={user} />
        <Feedback user={user} />
      </Fragment>  
    </div>
  );
};
