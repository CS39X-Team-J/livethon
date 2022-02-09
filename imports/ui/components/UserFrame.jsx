import { Fragment } from "react";
import { Routes, useNavigate, Route } from "react-router-dom";
import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from 'meteor/meteor';
import { InstructorView } from "../pages/instructor/InstructorView";
import { StudentView } from "../pages/student/StudentView";

export function UserFrame() {
    const user = useTracker(() => Meteor.user());
    let navigate = useNavigate();


  return (
    <Fragment>
      <div>
        <button
          onClick={() => {
            Meteor.logout();
            navigate("/");
          }}
        >
          Logout
        </button>{" "}
        Logged in as {user?.username}
      </div>
      <Routes>
              <Route
                path="instructor"
                element={<InstructorView></InstructorView>}
              />
              <Route path="student" element={<StudentView></StudentView>} />
      </Routes>
    </Fragment>
  );
}