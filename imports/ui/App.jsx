import { Meteor } from "meteor/meteor";
import React, { createContext } from "react";
import { LoginForm } from "./pages/login/LoginForm.jsx";
import {
  Route,
  Routes,
} from "react-router-dom";
import { UserFrame } from "./components/UserFrame.jsx";
import { WebWorkerPool } from '../api/webworker-pool.js';

export const CompilationRequestContext = createContext();

// create a pyodide webworker pool with 3 threads and 1 second timeout
const pool = new WebWorkerPool(3, 1);

export const App = () => {

  // This map will be used to coordinate which promises to resolve from window.onmessage
  // Previously, window.onmessage was set to the latest compilation request
  // When multiple compile requests were sent around the same time,
  // sometimes only the most recent one seemed to run, since the value of window.onmessage for prior
  // requests were overwritten by newer requests before the older requests are processed.

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
      <div className="app">
          <Routes>
            <Route exact path="/" element={<LoginForm/>} />
            <Route path="/*" element={<UserFrame/>}></Route>
          </Routes>
      </div>
    </CompilationRequestContext.Provider>
  );
};
