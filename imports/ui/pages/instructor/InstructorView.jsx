import React, { useContext } from "react";
import { getCodeBySession } from "../../components/Module.jsx";
import { useTracker } from "meteor/react-meteor-data";
import { Solution } from "../../components/Solution.jsx";
import { SessionContext } from "../../App.jsx";
import { useNavigate } from "react-router-dom";

export const InstructorView = () => {
  const user = useTracker(() => Meteor.user());
  const { session, setSession } = useContext(SessionContext);
  const navigate = useNavigate();
  
  const modules = useTracker(() => {
    return getCodeBySession({ session });
  });

  const navigateTo = (path) => {
    navigate(path);
  }

  return (

    <div className="InstructorView">
      <button onClick={() => navigateTo("create")}>New Session</button>
      <h1>{ session }</h1>
        {modules.map((module) => {
          return (
            <Solution module={module} key={module._id}></Solution>
          );
        })}
    </div>
  );
};
