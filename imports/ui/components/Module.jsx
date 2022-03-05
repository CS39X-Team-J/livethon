import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

import React, { useContext } from 'react';
import { CompilationRequestContext } from '../App';
import { execute } from '../services/CodeSnapshot';
import { ResultViewer } from "./ResultViewer";
import { updateModule } from "../../api/methods/updateModule";
import { createSnapshot } from "../../api/methods/createSnapshot";
import { useParams } from "react-router-dom";

export const Module = ({ module, title, onSelectionChange, readonly, region }) => {
  const { request, reset } = useContext(CompilationRequestContext);
  const params = useParams();

  const onChange = async (currentSnapshot) => {
    
    let createdAt = new Date();

    // 1. readonly means we are viewing past snapshots that we do not want to replace our current code
    // 2. if currentSnapshot is the same as the module.code and onChange is called, 
    // then we have a duplicate trigger of onChange and do nothing
    if (currentSnapshot != module.code && !readonly) {

      updateModule.call({
        moduleID: module._id,
        code: currentSnapshot,
        createdAt,          
      });

      const output = await execute(module._id, currentSnapshot, request, createdAt);

      console.log(output)

      createSnapshot.call({
        code: currentSnapshot,
        output,
        session: params.session,
        user: module.user,
        createdAt,
      });

    }
  }

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
          markers={region.map(r => {
            return {
              startRow: r.start.row,
              startCol: r.start.column,
              endRow: r.end.row,
              endCol: r.end.column,
              className: 'error-marker',
              type: 'text',
            }
          })}
        />

        <button onClick={() => { reset(); compile(module, module.code, request); }}>Reset Python Environment</button>
        
        <ResultViewer module={module} />

    </div>
  );
};
