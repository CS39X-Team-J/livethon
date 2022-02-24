import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

import React, { useState, useEffect, useContext } from 'react';
import { CompilationRequestContext } from '../App';
import { compile, logSnapshot } from '../services/CodeSnapshot';
import { ResultViewer } from "./ResultViewer";
import { ModulesCollection, RunsCollection } from "../../api/modules";


export const Module = ({ module, title, onSelectionChange, readonly, region }) => {
  const { request, reset } = useContext(CompilationRequestContext);
  const [markers, setMarkers] = useState([]);

  const onChange = async (currentSnapshot) => {
    
    let createdAt = new Date();

    // readonly means we are viewing past snapshot that we do not want to replace our current code
    // if currentSnapshot is the same as the module.code and onChange is called, 
    // then we have a duplicate trigger of onChange and do nothing
    if (currentSnapshot != module.code) {
      const output = await compile(module, currentSnapshot, request);
      
      RunsCollection.insert({
        module: module._id,
        input: "",
        output,
        createdAt,
      });

      // if code isn't readonly (actually own student code)
      // update modules collection and logSnapshot
      if (!readonly) {
        ModulesCollection.update(module._id, {
          $set: {
            code: currentSnapshot,
            createdAt,
          }
        });

        logSnapshot(module, createdAt, currentSnapshot, output);
      }
    }
  }

  // compile on page load
  useEffect(() => {
    compile(module, module.code, request);
  }, []);

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
  }, [region]);

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

        <button onClick={() => { reset(); compile(module, module.code, request); }}>Reset Python Environment</button>
        
        <ResultViewer module={module} />

    </div>
  );
};
