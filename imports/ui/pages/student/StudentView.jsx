import { Meteor } from 'meteor/meteor';
import React, { useContext, useState } from "react";
import { Module } from "../../components/Module.jsx";
import { Feedback } from "../../components/Feedback.jsx";
import { useTracker } from 'meteor/react-meteor-data';
import { SnapshotsCollection, FeedbackCollection, SessionsCollection, ModulesCollection } from '../../../api/modules.js';
import { useParams } from "react-router-dom";
import { addSessionUser } from '../../../api/methods/addSessionUser.js';
import { createModule } from '../../../api/methods/createModule.js';
import { execute } from '../../services/run-code.js';
import { updateModule } from '../../../api/methods/updateModule.js';
import { createSnapshot } from '../../../api/methods/createSnapshot.js';
import { WebWorkerPool } from '../../../api/webworker-pool';

// create a pyodide webworker pool with 3 threads and 1 second timeout
const pool = new WebWorkerPool({ threads: 3, timeout: 1 });

export const StudentView = () => {
  const params = useParams();
  const user = Meteor.user();

  const [currentFocus, setFocus] = useState({
    module: true,
    feedbackID: null,
  });

  const onChange = async (currentCode) => {

    let createdAt = new Date();

    // only update module and create snapshots if user is working with current code and has made a change
    if (currentFocus.module && currentCode != module.code) {

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
      await execute({ moduleID: module._id, code: currentCode, pool, createdAt });

    }

  }

  const setupModule = ({ sessionData, createdAt }) => {
    // create module and then create first run
    createModule.call({
      code: sessionData.template ? sessionData.template : '',
      createdAt,
      session: sessionData.name,
    }, (err, res) => {

      if (!err) {
        // create first run
        const mod = ModulesCollection.findOne({ session: sessionData.name, user: user._id });
        execute({ moduleID: mod._id, code: sessionData.template, pool, createdAt: mod.createdAt });

      } else {
        alert(err);
      }

    });
  }

  // get module for student in this session
  // if student has no module for this session, that means the user is joining for the first time
  // and we need to add student to session
  const { module, session } = useTracker(() => {

    const createdAt = new Date();
    const sessionSubscription = Meteor.subscribe('sessions');
    const moduleSubscription = Meteor.subscribe('modules', params.session);
    // TODO: subscribe to users collection

    const sessionData = SessionsCollection.findOne({ name: params.session });
    const moduleData = sessionData ? ModulesCollection.findOne({ session: sessionData.name, user: user._id }) : undefined;

    // when sessions subscription is ready, we are guaranteed to get actual results from queries
    if (sessionSubscription.ready() && moduleSubscription.ready()) {

      // check if session exists
      if (sessionData == undefined) {
        alert(`Session ${params.session} does not exist!`);
      }

      // if user is not in session, add to session and create module
      if (!SessionsCollection.findOne({ name: sessionData.name, users: { $in: [user._id] } })) {
        
        // add user to session
        addSessionUser.call({
          session: sessionData.name,
        }, (err, res) => {
          if (!err) {
            setupModule({ sessionData, createdAt });
          }
        });

      }
    }

    return {
      module: moduleData,
      session: sessionData,
    }

  });

  const history = useTracker(() => {
    const snapshotSubscription = Meteor.subscribe('snapshots', params.session);
    const feedbackSubscription = Meteor.subscribe('feedback', params.session);
    let feedbackData = null;
    let selectedFeedback = null;
    let snapshotData = null;

    if (module) {
      feedbackData = FeedbackCollection.find({ module: module._id }).fetch();
    }

    if (!currentFocus.module) {
      selectedFeedback = FeedbackCollection.findOne({ _id: currentFocus.feedbackID });
      snapshotData = SnapshotsCollection.findOne({ _id: selectedFeedback.snapshot });
    }

    return {
      isReady: snapshotSubscription.ready() && feedbackSubscription.ready() && module != undefined,
      snapshotData,
      feedbackData,
      selectedFeedback,
    }

  });

  const resetPyodide = () => {
    pool.reset();
    execute({ moduleID: module._id, code: module.code, pool, createdAt: new Date() });
  }

  const focusFeedback = (id) => () => {
    setFocus({ module: false, feedbackID: id });
  }

  const endFocusFeedback = (id) => () => {
    setFocus({ module: true });
  }

  if (history.isReady) {
    return (

      <div className="studentModule">

        <div>
          <h1>{session ? session.instructions.title : ""}</h1>
          <p>{session ? session.instructions.description : null}</p>
          {module ? <Module
            moduleID={module._id}
            content={currentFocus.module ? module : history.snapshotData}
            region={currentFocus.module ? [] : history.selectedFeedback.region ? history.selectedFeedback.region : []}
            onChange={onChange}
            reset={resetPyodide}
          /> : ''}
        </div>

        {history.isReady ? <Feedback feedback={history.feedbackData} beginFocus={focusFeedback} endFocus={endFocusFeedback} /> : ''}
      </div>
    );
  } else {
    return (<p>Loading...</p>)
  }

};
