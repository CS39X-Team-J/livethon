import { Meteor } from 'meteor/meteor';
import React, { useState, Fragment, useEffect } from "react";
import { getModules, Module } from "./components/Module.jsx";
import { Feedback } from "./components/Feedback.jsx";
import { useTracker } from 'meteor/react-meteor-data';
import { LoginForm } from './pages/login/LoginForm.jsx';
import { StudentView } from './pages/student/StudentView.jsx';
import { InstructorView } from './pages/instructor/InstructorView.jsx';

export const App = () => {
  const user = useTracker(() => Meteor.user());
  
  return (
    <div className="app">
      { user ? (user.username == "instructor" ? ( <InstructorView user={user} /> ) : ( <StudentView user={user} /> )) : ( <LoginForm/> )  }      
    </div>
  );
};
