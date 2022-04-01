import React from "react";
import { useParams } from "react-router-dom";
import { ModulesCollection } from "../../../api/modules.js";

export const TestsEdit = () => {

  const params = useParams();

  return (

    <div className="TestsView">
      <h1>Tests</h1>
    </div>
  );

};
