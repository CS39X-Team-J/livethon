import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Solution } from "../../components/Solution.jsx";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { ModulesCollection } from "../../../api/modules.js";

export const InstructorView = () => {
  const params = useParams();
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  }

  return (

    <div className="InstructorView">
      <div>
        <button onClick={() => navigateTo("/instructor/session/create")}>New Session</button>
        <button onClick={() => navigateTo("tests")}>Tests</button>
        <button onClick={() => navigateTo("edit")}>Session Details</button>
      </div>

      <Outlet />
    </div>
  );

};
