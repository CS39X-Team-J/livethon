import { Meteor } from "meteor/meteor";
import React, { useState, createContext } from "react";
import { LoginForm } from "./pages/login/LoginForm.jsx";
import {
  Route,
  Routes,
} from "react-router-dom";
import { UserFrame } from "./components/UserFrame.jsx";
import { WebWorkerPool } from '../api/webworker-pool.js';

export const CompilationRequestContext = createContext();
export const SessionContext = createContext();

const pool = new WebWorkerPool(3, 1);

export const App = () => {
  const [session, setSession] = useState("lab01");

  // This map will be used to coordinate which promises to resolve from window.onmessage
  // Previously, window.onmessage was set to the latest compilation request
  // When multiple compile requests were sent around the same time,
  // sometimes only the most recent one seemed to run, since the value of window.onmessage for prior
  // requests were overwritten by newer requests before the older requests are processed.
  const [compilations, setCompilations] = useState(new Map());

  const logout = () => {
    Meteor.logout();
  };

  return (
    <CompilationRequestContext.Provider value={
      {
        request: ({ code, id}) => { return pool.requestCompilation({ code, id }); },
        reset: () => { pool.reset(); },
      }  
    }>
      <SessionContext.Provider value={{ session, setSession }}>
        <div className="app">
            <Routes>
              <Route exact path="/" element={<LoginForm/>} />
              <Route path="/*" element={<UserFrame/>}></Route>
            </Routes>
        </div>
      </SessionContext.Provider>
    </CompilationRequestContext.Provider>
  );
};
