import { Meteor } from 'meteor/meteor';
import React, { useState, Fragment, useEffect, useContext } from "react";
import { Module, addStudentToSession, getLatestStudentSnapshot, getCodeByStudentSession } from "../../components/Module.jsx";
import { Feedback } from "../../components/Feedback.jsx";
import { useTracker } from 'meteor/react-meteor-data';
import { SessionContext } from '../../App.jsx';

export const StudentView = () => {
  const user = useTracker(() => Meteor.user());
  const { session } = useContext(SessionContext);

  const [module, setModule] = useTracker(() => {
    const code = getCodeByStudentSession({ session, user });
    if (!code) {
      addStudentToSession({ session, user });
    }
    return [getCodeByStudentSession({ session, user })];
  });

  return (
    
    <div className="studentModule">
        <Module module={module} />
        <Feedback user={user} />
    </div>
  );
};
