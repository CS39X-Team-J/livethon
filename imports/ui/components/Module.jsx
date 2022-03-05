import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

import React, { useContext, useEffect } from 'react';
import { CompilationRequestContext } from '../App';
import { execute } from '../services/CodeSnapshot';
import { ResultViewer } from "./ResultViewer";
import { updateModule } from "../../api/methods/updateModule";
import { createSnapshot } from "../../api/methods/createSnapshot";
import { useParams } from "react-router-dom";

export const Module = ({ moduleID, content, region, onChange, execute }) => {

  return (
    <div className="module-container">

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
          name={moduleID}
          editorProps={{ $blockScrolling: true }}
          value={content.code}
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

        {/* <button onClick={() => { reset(); compile(module, module.code, request); }}>Reset Python Environment</button> */}
        
        <ResultViewer moduleID={moduleID} createdAt={content.createdAt}/>

    </div>
  );
};
