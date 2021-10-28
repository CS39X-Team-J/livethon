import React, { useState, useEffect, useContext, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { ModulesCollection, RunsCollection, SessionsCollection, SnapshotsCollection } from '../../api/modules';
import { CompilationRequestContext } from '../App';

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

export const createSnapshot = ({ module, code, output, date }) => {
  return SnapshotsCollection.insert({
    code,
    output,
    createdAt: date,
    session: module.session,
    user: module.user,
  });
}

export const getCodeBySession = ({ session }) => {
  return useTracker(() => { return ModulesCollection.find({ session }).fetch() });
}

export const getSnapshotsByStudentSession = ({ session, user }) => {
  return SnapshotsCollection.find({ session, user }, { sort: { createdAt: -1 } }).fetch();
}

export const getSnapshotByStudentSessionDate = ({ session, user, date }) => {
  return SnapshotsCollection.findOne({ session, user, createdAt: date });
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

export const Module = ({ module, title, onSelectionChange, readonly, region }) => {
  const request = useContext(CompilationRequestContext);
  const [output, setOutput] = useState(null);
  const [markers, setMarkers] = useState([]);

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

  const logSnapshot = async (time, currentSnapshot) => {
    const lastSnapshotDate = SnapshotsCollection.findOne({ user: module.user, session: module.session }, { sort: { createdAt: -1 }}).createdAt;
    if ((time.getTime() - lastSnapshotDate.getTime()) > MIN_SNAPSHOT_DELAY) {
      // add snapshot to snapshot collection
      createSnapshot({ module, code: currentSnapshot, output, date: time });
    }
  }

  const onChange = (currentSnapshot) => {
    let currentTime = new Date();

    // readonly means we are viewing past snapshot that we do not want to replace our current code
    // if currentSnapshot is the same as the module.code and onChange is called, then we have a duplicate trigger of onChange
    if (!readonly && currentSnapshot != module.code) {
      ModulesCollection.update(module._id, {
        $set: {
          code: currentSnapshot,
          createdAt: currentTime,
        }
      });
    }

    compile(currentSnapshot);
    
    logSnapshot(currentTime, currentSnapshot);
    
  }

  
  useEffect(() => {
    compile(module.code);
  }, [readonly])

  useEffect(() => {
    compile(module.code);
  }, []);

  useEffect(() => {
    // don't let a reload of the page temporarily remove output
    // for other client's looking at the same code
    if (output != null && !readonly) {
      RunsCollection.insert({
        module: module._id,
        input: "",
        output,
        createdAt: new Date()
      });
    }    
  }, [output]);

  useEffect(() => {
    setMarkers(region.map(r => {
      return {
        startRow: r.start.row,
        startCol: r.start.column,
        endRow: r.end.row,
        endCol: r.end.column,
        className: 'error-marker',
        type: 'text',
      }
    }))
  }, [region])

  return (
    <div className="module-container">
        
        <h3>{title}</h3>

        <AceEditor
          mode="python"
          theme="github"
          setOptions={{
            useSoftTabs: true
          }}
          highlightActiveLine={false}
          height="400px"
          width="600px"
          onChange={onChange}
          debounceChangePeriod={1000}
          name={module._id}
          editorProps={{ $blockScrolling: true }}
          value={module.code}
          markers={markers}
        />
        
        {/* <ResultViewer module_id={module._id} /> */}
        <div className="output">
          {output}
        </div>

    </div>
  );
};
