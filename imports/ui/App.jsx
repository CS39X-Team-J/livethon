import { Meteor } from 'meteor/meteor';
import React, { useState, Fragment, useEffect } from "react";
import { useTracker } from 'meteor/react-meteor-data';
import { LoginForm } from './pages/login/LoginForm.jsx';
import { StudentView } from './pages/student/StudentView.jsx';
import { InstructorView } from './pages/instructor/InstructorView.jsx';
import { createContext } from 'react';
import { WebWorkerPool } from '../api/webworker-pool.js';

export const CompilationRequestContext = createContext();
export const SessionContext = createContext();

const pool = new WebWorkerPool(3, 1);

export const App = () => {
  const user = useTracker(() => Meteor.user());
  const [session, setSession] = useState("lab01");
  
  // This map will be used to coordinate which promises to resolve from window.onmessage
  // Previously, window.onmessage was set to the latest compilation request
  // When multiple compile requests were sent around the same time,
  // sometimes only the most recent one seemed to run, since the value of window.onmessage for prior
  // requests were overwritten by newer requests before the older requests are processed.
  const [compilations, setCompilations] = useState(new Map());
  
  const logout = () => {
    Meteor.logout();
  }

  return (
    <CompilationRequestContext.Provider value={
      {
        request: ({ code, id}) => { return pool.requestCompilation({ code, id }); },
        reset: () => { pool.reset(); },
      }  
    }>
      <SessionContext.Provider value={{ session, setSession }}>
        { user ? (<Fragment><button onClick={logout}>Logout</button> Logged in as {user.username}</Fragment>) : "" }
        <div className="app">
          { user ? (user.username == "instructor" ? ( <InstructorView/> ) : ( <StudentView/> )) : ( <LoginForm/> )  }      
        </div>
      </SessionContext.Provider>
    </CompilationRequestContext.Provider>
  );
};
