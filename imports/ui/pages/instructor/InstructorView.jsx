import React, { Fragment } from "react";
import { getModules } from "../../components/Module.jsx";
import { useTracker } from "meteor/react-meteor-data";
import { Solution } from "../../components/Solution.jsx";

export const InstructorView = ({ user }) => {
  const [modules, setModules] = useTracker(() => {
    return getModules(user);
  });

  return (

    <div className="InstructorView">
        {getModules(user).map((module) => {
          return (
            <Solution module={module} key={module._id}></Solution>
          );
        })}
    </div>
  );
};
