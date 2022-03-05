import React, { useContext } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Solution } from "../../components/Solution.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { getCodeBySession } from "../../services/Session.js";

export const InstructorView = () => {
  const params = useParams();
  const navigate = useNavigate();

  const modules = useTracker(() => {
    return getCodeBySession({ session: params.session });
  });

  const navigateTo = (path) => {
    navigate(path);
  }

  return (

    <div className="InstructorView">
      <button onClick={() => navigateTo("/instructor/session/create")}>New Session</button>
      <h1>{ params.session }</h1>
        {modules.map((module) => {
          return (
            <Solution module={module} key={module._id}></Solution>
          );
        })}
    </div>
  );

};
