import { Fragment } from "react";
import { Routes, useNavigate, Route } from "react-router-dom";
import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { InstructorView } from "../pages/instructor/InstructorView";
import { StudentView } from "../pages/student/StudentView";
import { SessionView } from "../pages/instructor/SessionView";
import { SessionEdit } from "../pages/instructor/SessionEdit";
import { TestsEdit } from "../pages/instructor/TestsEdit";

export function UserFrame() {
  const user = useTracker(() => Meteor.user());
  let navigate = useNavigate();

  return (
    <Fragment>
      <div>
        <button onClick={() => { 
            Meteor.logout();
            navigate("/");
          }}
        >
          Logout
        </button>{" "}
        Logged in as {user?.username}
      </div>

      <Routes>
        
        <Route path="instructor/session/id/:session" element={<InstructorView/>}> 

          <Route path="view" element={<SessionView/>} />
          <Route path="edit" element={<SessionEdit/>} />
          <Route path="tests" element={<TestsEdit/>} />

        </Route>
        
        <Route path="instructor/session/create" element={<SessionEdit isNew={true} />} />      

        <Route path="student/session/:session" element={<StudentView/>} />

      </Routes>

    </Fragment>
  );
}
