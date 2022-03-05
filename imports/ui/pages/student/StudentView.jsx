import { Meteor } from 'meteor/meteor';
import React, { useContext, useState } from "react";
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

export const StudentView = () => {
  const params = useParams();
  const user = Meteor.user();
  const [currentFocus, setFocus] = useState("CURRENT");
  const { request, reset } = useContext(CompilationRequestContext);

  // get module for student in this session
  // if student has no module for this session, that means the user is joining for the first time
  // and we need to add student to session
  const { module, session } = useTracker(() => {
    const createdAt = new Date();
    const sessionSubscription = Meteor.subscribe('sessions');
    const moduleSubscription = Meteor.subscribe('modules');

    const sessionData = SessionsCollection.findOne({ name: params.session });
    const moduleData = sessionData ? ModulesCollection.findOne({ session: sessionData.name, user: user._id }) : undefined;

    // when sessions subscription is ready
    if (sessionSubscription.ready()) {

      // check if session exists
      if (sessionData == undefined) {
        alert(`Session ${params.session} does not exist!`);
      }
  
      // if user is not in session, add to session and create module
      if (!SessionsCollection.findOne({ name: sessionData.name, users: { $in: [user._id] }}) ) {
        addSessionUser.call({
          session: sessionData.name,
          user: user._id,
        }, (err, res) => {
          if (err) {
            alert(err);
          } else {
            // success!
            console.log("User successfully added to session!");
          }
        });
  
        // create module
        const moduleID = createModule.call({
          code: sessionData.template ? sessionData.template : '',
          createdAt,
          user: user._id,
          session: sessionData.name,
        }, (err, res) => {
          if (err) {
            alert(err);
          } else {
            console.log("Module successfully created!");
          }
        });
  
        // execute template code
        execute(moduleID, sessionData.template, request, createdAt);
  
      }
    }

    return {
      module: moduleData,
      session: sessionData,
    }
    
  });

  const focusFeedback = (id) => () => {
    const feedback = FeedbackCollection.findOne({ _id: id });
    setFocus({
      // prevent crashing when snapshot not found
      snapshot: SnapshotsCollection.findOne({ _id: feedback.snapshot}) || {},
      feedback,
    });
  }

  const endFocusFeedback = (id) => () => {
    setFocus("CURRENT");
  }

  return (
    
    <div className="studentModule">

        <div>
          <h1>{session ? session.name : ""}</h1>
          <p>{session ? session.instructions?.description : ""}</p>
          {module ? <Module module={currentFocus == "CURRENT" ? module : currentFocus.snapshot } readonly={currentFocus != "CURRENT"} region={currentFocus != "CURRENT" ? currentFocus.feedback.region : []}/> : ''}
        </div>

        {module ? <Feedback module={module} beginFocus={focusFeedback} endFocus={endFocusFeedback}/> : ''}
    </div>
  );
};
