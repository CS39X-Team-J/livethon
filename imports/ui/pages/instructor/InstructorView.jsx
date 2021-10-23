import React, { useContext } from "react";
import { getCodeBySession } from "../../components/Module.jsx";
import { useTracker } from "meteor/react-meteor-data";
import { Solution } from "../../components/Solution.jsx";
import { SessionContext } from "../../App.jsx";

export const InstructorView = () => {
  const user = useTracker(() => Meteor.user());
  const { session, setSession } = useContext(SessionContext);

  const modules = useTracker(() => {
    return getCodeBySession({ session });
  });

  return (

    <div className="InstructorView">
        {modules.map((module) => {
          return (
          <Solution module={module} key={module._id}></Solution>
          );
        })}
    </div>
  );
};
