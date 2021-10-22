import React, { useState, useEffect, useContext } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { ModulesCollection, RunsCollection } from '../../api/modules';
import { CompilationRequestContext } from '../App';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

const studentJoin = ({ session, user }) => {

}


export const getLatestSnapshots = ({ user, session }) => {
  if (user.username == "instructor") {
    return ModulesCollection.find({}).fetch();
  }
  let modules = ModulesCollection.findOne({ user: user._id, session: session }, { sort: { createdAt: -1 }}).fetch();
  
  if (modules.length < 1) {
    modules = ModulesCollection.insert({ snapshot: "# Type your solution to the exercise here", createdAt: new Date(), user: user._id, session: session });
  }
  
  return useTracker(() => modules);
}  

export const ResultViewer = ({ module_id }) => {
  const run = useTracker(() => {
    return RunsCollection.findOne({ module: module_id }, {sort: {createdAt: -1}});
  });

  return <div className="output">
    {run && <div >{run.output}</div>}
  </div>;
}

export const Module = ({ user, title }) => {
  const request = useContext(CompilationRequestContext);
  const [output, setOutput] = useState(null);

  const compile = async (script, setOutput) => {
    try {
        const results = await request({id: module._id, code: script});
        let output = results.error ? results.error : results.stdout;
        setOutput(output);
      } catch(error) {
        console.warn(error)
      }
  }

  const onChange = (setOutput) => async (newVal, event) => {
    const snapshot = newVal;
    ModulesCollection.insert({
      snapshot,
      createdAt: new Date(),
      session,
      user: user._id,
    });
  
    compile(snapshot, setOutput);
  }

  useEffect(() => {
    compile(module.snapshot, setOutput);
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
          onChange={onChange(module, setOutput)}
          debounceChangePeriod={1000}
          name={module._id}
          editorProps={{ $blockScrolling: true }}
          value={module.contents}
        />
        
        {output ? <ResultViewer module_id={module._id} /> : <p>Missing output</p>}

    </div>
  );
};
