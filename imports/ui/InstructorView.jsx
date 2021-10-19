import React, { Fragment } from "react";
import { getModules } from "./Module.jsx";
import { useTracker } from "meteor/react-meteor-data";
import { Solution } from "./Solution.jsx";

export const InstructorView = ({ user }) => {
  const [modules, setModules] = useTracker(() => {
    return getModules(user);
  });

  return (
    <div className="InstructorView">
      <Fragment>
        {getModules(user).map((module) => {
          return (
            <Solution module={module} key={module._id}></Solution>
          );
        })}
      </Fragment>
    </div>
  );
};
