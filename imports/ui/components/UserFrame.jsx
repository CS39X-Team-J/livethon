import { Fragment } from "react";
import { Routes, useNavigate, Route, useParams } from "react-router-dom";
import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { InstructorView } from "../pages/instructor/InstructorView";
import { StudentView } from "../pages/student/StudentView";
import { SessionView } from "../pages/instructor/SessionView";
import { SessionEdit } from "../pages/instructor/SessionEdit";
import { SessionCreate } from "../pages/instructor/SessionCreate";
import { TestsEdit } from "../pages/instructor/TestsEdit";

export function UserFrame() {
  const params = useParams();
  const user = useTracker(() => Meteor.user());
  let navigate = useNavigate();

  const logout = () => {
    Meteor.logout();
    navigate("/");
  }

  return (
    <Fragment>
      <div>
        <p>{user?.username}</p>
        <button onClick={logout}>Logout</button>{" "}
      </div>

      <Routes>
        
        <Route path="instructor/session/id/:session" element={<InstructorView/>}> 

          <Route path="view" element={<SessionView/>} />
          <Route path="edit" element={<SessionEdit/>} />
          <Route path="tests" element={<TestsEdit/>} />

        </Route>
        
        <Route path="instructor/session/create" element={<SessionCreate/>} />      

        <Route path="student/session/:session" element={<StudentView/>} />

      </Routes>

    </Fragment>
  );
}
