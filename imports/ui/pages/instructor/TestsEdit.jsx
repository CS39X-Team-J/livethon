import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useParams } from "react-router-dom";
import { ModulesCollection } from "../../../api/modules.js";

export const TestsEdit = () => {

  const params = useParams();

  return (

    <div className="TestsView">
      <h1>Test Edit View</h1>
    </div>
  );

};
