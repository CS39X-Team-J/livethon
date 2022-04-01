import React, { Component, useContext, useState } from "react";
import AceEditor from "react-ace";
import { SessionsCollection } from "../../../api/modules";
import { createSession } from "../../../api/methods/createSession";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-python";
import { useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { SessionEditForm } from "./SessionEditForm";

export const SessionCreate = () => {

  const [sessionData, setSessionData] = useState({
    name: "",
    title: "",
    description: "",
    template: "",
  });

  // check if session name is already in use
  const uniqueName = useTracker(() => {
    
    const subscription = Meteor.subscribe('sessions');

    return {
      isReady: subscription.ready(),
      unique: !SessionsCollection.findOne({ name: sessionData.name })
    }

  });

  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  }

  const handleChange = (key, value) => {
    setSessionData({ ...sessionData, [key]: value });
  }

  // call createSession Meteor method if name is unique
  const submit = () => {

    if (uniqueName.unique) {

      createSession.call({
        ...sessionData,
        createdAt: new Date(),
      }, (err, res) => {
        if (err) {
          alert(err);
        } else {
          navigate(`/instructor/session/id/${sessionData.name}/view`);
        }
      });

    }    

  }

  if (uniqueName.isReady) {
    return (
      
      <form className="sessionCreationForm">
        
        <div className="scf-entry">
          <label>
            <strong>Session name: </strong>
            <input
              type="text"
              name="name"
              value={sessionData.name}
              onChange={(e) => { handleChange("name", e.target.value) }}
            ></input>
          </label>
        </div>
  
        <SessionEditForm handleChange={handleChange} sessionData={sessionData} submit={submit} />
  
        <p className="error-msg-body">{!uniqueName.unique ? "Name already in use. Please pick a different name" : ""}</p>
  
      </form>

    );
  } else {
    return (<p>Loading...</p>);
  }

  

}
