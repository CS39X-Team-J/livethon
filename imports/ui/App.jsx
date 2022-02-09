import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { LoginForm } from "./pages/login/LoginForm.jsx";
import { createContext } from "react";
import {
  Route,
  Routes,
} from "react-router-dom";
import { UserFrame } from "./components/UserFrame.jsx";

export const CompilationRequestContext = createContext();
export const SessionContext = createContext();

const worker = new Worker("/py-runner.js");

export const App = () => {
  const [session, setSession] = useState("lab01");

  worker.onmessage = (e) => {
    // resolve the promise by the module id
    compilations.get(e.data.id)(e.data);
  };

  // This map will be used to coordinate which promises to resolve from window.onmessage
  // Previously, window.onmessage was set to the latest compilation request
  // When multiple compile requests were sent around the same time,
  // sometimes only the most recent one seemed to run, since the value of window.onmessage for prior
  // requests were overwritten by newer requests before the older requests are processed.
  const [compilations, setCompilations] = useState(new Map());
  const request = ({ code, id }) => {
    // save promise resolve to map, so when onmessage receives a response
    // we can resolve the right promise
    let promise = new Promise(function (resolve, reject) {
      compilations.set(id, resolve);
    });

    // instruct the worker to handle the request
    worker.postMessage({
      code,
      id,
    });

    // module components can await their code output
    return promise;
  };

  const logout = () => {
    Meteor.logout();
  };

  return (
    <CompilationRequestContext.Provider value={request}>
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
