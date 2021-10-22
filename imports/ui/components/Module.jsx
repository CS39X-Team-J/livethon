import React, { useState, useEffect, useContext } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { ModulesCollection, RunsCollection } from '../../api/modules';
import { CompilationRequestContext } from '../App';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

export const getModules = (user) => {
  if (user.username == "instructor") {
    return ModulesCollection.find({}).fetch();
  }
  let modules = ModulesCollection.find({ user: user._id }).fetch();
  
  if (modules.length < 1) {
    modules = ModulesCollection.insert({contents: "print(\"Hello, world!\")", createdAt: new Date(), user: user._id});
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

export const Module = ({ module, title }) => {
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

  const onChange = (module, setOutput) => async (newVal, event) => {
    const script = newVal;
    ModulesCollection.update(module._id, {
      $set: {
        contents: script
      }
    });
  
    compile(script, setOutput);
  }

  useEffect(() => {
    compile(module.contents, setOutput);
  }, []);

  useEffect(() => {
    RunsCollection.insert({
        module: module._id,
        input: "",
        output,
        createdAt: new Date()
    });
  }, [output]);

  return (
    <div>
        <h2>{title}</h2>
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
