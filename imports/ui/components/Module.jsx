import React, { useState, useEffect, useContext, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { ModulesCollection, RunsCollection, SessionsCollection, SnapshotsCollection } from '../../api/modules';
import { CompilationRequestContext, SessionContext } from '../App';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

export const addStudentToSession = ({ session, user }) => {
  // only insert into modules collection, since we don't care about starter code in the snapshot collection
  ModulesCollection.insert({ 
    code: "# Type your solution here",
    createdAt: new Date(),
    user,
    session,
  });
  
  let sessionID = SessionsCollection.findOne({ session })._id;

  if (!(getStudentsBySession({ session }).includes(user))) {
    SessionsCollection.update({ _id: sessionID }, {
      $addToSet: { users: user }
    });  
  }
}

export const getStudentsBySession = ({ session }) => {
  return SessionsCollection.findOne({ session }).users;
}

export const getCodeBySession = ({ session }) => {
  return ModulesCollection.find({ session }).fetch();
}

export const getSnapshotsByStudentSession = ({ session, user }) => {
  return SnapshotsCollection.find({ session, user }, { sort: { createdAt: -1 } }).fetch();
}

export const getCodeByStudentSession = ({ session, user }) => {
  return ModulesCollection.findOne({ session, user });
}

export const ResultViewer = ({ module_id }) => {
  const run = useTracker(() => {
    return RunsCollection.findOne({ module: module_id }, { sort: {createdAt: -1}});
  });

  return <div className="output">
    {run && <div >{run.output}</div>}
  </div>;
}

// seconds from last snapshot before onchange can log another snapshot
const MIN_SNAPSHOT_DELAY = 10;

export const Module = ({ module, title }) => {
  const request = useContext(CompilationRequestContext);
  const { session } = useContext(SessionContext);
  const [output, setOutput] = useState(null);
  const [lastSnapshotDate, setLastSnapshotDate] = useState(new Date())

  // https://stackoverflow.com/questions/57624060/how-can-i-check-if-the-component-is-unmounted-in-a-functional-component
  const mounted = useRef(false);
  useEffect(() => {
      mounted.current = true;
      return () => { mounted.current = false; };
  }, []);

  const compile = async (script) => {
    try {
        const results = await request({id: module._id, code: script});

        // only set state when this component is mounted
        if (mounted.current) {
          setOutput(results.error ? results.error : results.stdout);
        }

      } catch(error) {
        console.warn(error)
      }
  }

  const onChange = (currentSnapshot) => {

    if (currentSnapshot == ModulesCollection.findOne({ _id: module._id }).code) {
      // prevent one onChange event being duplicated
      // if client A makes change X to code, client B's onChange function will fire for that change X
      // This also fixes weird glitches where an idle client can "erase" an active 
      // client's modifications
      // Here is a bad explanation
      // Client A: adds "Hello!" and updates modules collection
      //                          Client B: sees update in modules collection
      // Client A: adds " World!" and updates modules collection
      //                          Client B: update of modules triggers onChange event and Client B updates modules to be "Hello!"
      // Client A: sees " World!" disappear and code is reverted to "Hello!" not "Hello! World!"
      return
    }

    // update current module
    ModulesCollection.update({
      _id: module._id
    }, {
      $set: {
        code: currentSnapshot
      }
    })

    // if the time since last collected snapshot is greater than MIN_SNAPSHOT_DELAY
    // record a snapshot and set last snapshot date to current time
    if (((new Date()).getTime() - lastSnapshotDate.getTime()) > MIN_SNAPSHOT_DELAY) {
      // add snapshot to snapshot collection
      SnapshotsCollection.insert({
        code: currentSnapshot,
        createdAt: new Date(),
        session,
        user: module.user,
      });

      setLastSnapshotDate(new Date());
    }

    // compile
    compile(currentSnapshot);
  }

  useEffect(() => {
    compile(module.code);
  }, []);

  useEffect(() => {
    // don't let a reload of the page temporarily remove output
    // for other client's looking at the same code
    if (output != null) {
      RunsCollection.insert({
        module: module._id,
        input: "",
        output,
        createdAt: new Date()
      });
    }    
  }, [output]);

  return (
    <div>
        
        {title ? (<h2>{title}</h2>) : ""}

        <AceEditor
          mode="python"
          theme="github"
          setOptions={{
            useSoftTabs: true
          }}
          height="200px"
          width="350px"
          onChange={onChange}
          debounceChangePeriod={1000}
          name={module._id}
          editorProps={{ $blockScrolling: true }}
          value={module.code}
        />
        
        {output ? <ResultViewer module_id={module._id} /> : <p>Missing output</p>}

    </div>
  );
};