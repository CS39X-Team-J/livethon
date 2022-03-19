import { Meteor } from "meteor/meteor";
import React, { createContext } from "react";
import { LoginForm } from "./pages/login/LoginForm.jsx";
import {
  Route,
  Routes,
} from "react-router-dom";
import { UserFrame } from "./components/UserFrame.jsx";

export const App = () => {

  return (
    <div className="app">
        <Routes>
          <Route exact path="/" element={<LoginForm/>} />
          <Route path="/*" element={<UserFrame/>}></Route>
        </Routes>
    </div>
  );
  
};
