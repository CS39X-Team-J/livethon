import { Meteor } from 'meteor/meteor';
import React, { useContext, useEffect, useState } from "react";
import { Module } from "../../components/Module.jsx";
import { Feedback } from "../../components/Feedback.jsx";
import { useTracker } from 'meteor/react-meteor-data';
import { SnapshotsCollection, FeedbackCollection, SessionsCollection, ModulesCollection } from '../../../api/modules.js';
import { addStudentToSession, getCodeByStudentSession } from '../../services/Session.js';
import { useParams } from "react-router-dom";
import { addSessionUser } from '../../../api/methods/addSessionUser.js';
import { createModule } from '../../../api/methods/createModule.js';
import { createRun } from '../../../api/methods/createRun.js';
import { execute } from '../../services/CodeSnapshot.js';
import { CompilationRequestContext } from '../../App.jsx';
import { updateModule } from '../../../api/methods/updateModule.js';
import { createSnapshot } from '../../../api/methods/createSnapshot.js';

export const StudentView = () => {
  const params = useParams();
  const user = Meteor.user();
  const [currentFocus, setFocus] = useState("module");
  const { request, reset } = useContext(CompilationRequestContext);

  const { snapshot, feedback } = useTracker(() => {
    Meteor.subscribe('snapshots');
    Meteor.subscribe('feedback');
    
    feedbackData = FeedbackCollection.findOne({ _id: currentFocus });
    snapshotData = SnapshotsCollection.findOne({ _id: feedbackData?.snapshot });

    return {
      snapshot: snapshotData,
      feedback: feedbackData,
    }
    
  });

  const onChange = async (currentCode) => {
    
    let createdAt = new Date();

    // only update module and create snapshots if user is working with current code and has made a change
    if (currentFocus == "module" && currentCode != module.code) {

      updateModule.call({
        moduleID: module._id,
        code: currentCode,
        createdAt,          
      });

      // TODO: restrict snapshot frequency
      createSnapshot.call({
        code: currentCode,
        session: params.session,
        user: module.user,
        createdAt,
      });    

      // execute code and add output to runs collection
      await execute(module._id, currentCode, request, createdAt);
      
    }

  }

  // get module for student in this session
  // if student has no module for this session, that means the user is joining for the first time
  // and we need to add student to session
  const { module, session } = useTracker(() => {
    const createdAt = new Date();
    const sessionSubscription = Meteor.subscribe('sessions');
    const moduleSubscription = Meteor.subscribe('modules');

    const sessionData = SessionsCollection.findOne({ name: params.session });
    const moduleData = sessionData ? ModulesCollection.findOne({ session: sessionData.name, user: user._id }) : undefined;

    // when sessions subscription is ready, we are guaranteed to get actual results from queries
    if (sessionSubscription.ready() && moduleSubscription.ready()) {

      // check if session exists
      if (sessionData == undefined) {
        alert(`Session ${params.session} does not exist!`);
      }
  
      // if user is not in session, add to session and create module
      if (!SessionsCollection.findOne({ name: sessionData.name, users: { $in: [user._id] }})) {
        
        // add user to session
        addSessionUser.call({
          session: sessionData.name,
          user: user._id,
        });
  
        // create module and then create first run
        createModule.call({
          code: sessionData.template ? sessionData.template : '',
          createdAt,
          user: user._id,
          session: sessionData.name,
        }, (err, res) => {
          if (!err) {
            console.log("Module successfully created!");
            const mod = ModulesCollection.findOne({ session: sessionData.name, user: user._id });
            execute(mod._id, sessionData.template, request, mod.createdAt); 
          } else {
            alert(err);
          }
        });

      }
    }

    return {
      module: moduleData,
      session: sessionData,
    }
    
  });

  const focusFeedback = (id) => () => {
    setFocus(id);
  }

  const endFocusFeedback = (id) => () => {
    setFocus("module");
  }

  return (
    
    <div className="studentModule">

        <div>
          <h1>{session ? session.title : ""}</h1>
          <p>{session ? session.instructions?.description : ""}</p>
          {module ? <Module 
                      moduleID={module._id}
                      content={currentFocus == "module" ? module : snapshot}
                      region={currentFocus == "module" ? [] : feedback.region}
                      onChange={onChange}
                    /> : ''}
        </div>

        {module ? <Feedback module={module} beginFocus={focusFeedback} endFocus={endFocusFeedback}/> : ''}
    </div>
  );
};
