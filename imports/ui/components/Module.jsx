import AceEditor from "react-ace";

import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/snippets/python"

import React from 'react';
import { ResultViewer } from "./ResultViewer";

export const Module = ({ moduleID, content, region, onChange, reset }) => {

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
          enableLiveAutocompletion= {true}
          enableSnippets={true}
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

        <button onClick={() => { reset(); }}>Reset Python Environment</button>
        
        <ResultViewer moduleID={moduleID} createdAt={content.createdAt}/>

    </div>
  );
};
