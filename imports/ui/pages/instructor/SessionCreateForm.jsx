import React, { Component, useState } from "react";
import AceEditor from "react-ace";
import { SessionsCollection } from "../../../api/modules";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-python";

export const SessionCreationForm = ({}) => {
  const [sessionData, setSessionData] = useState({
    errorMsg: "",
    name: "",
    title: "",
    description: "",
    sourceSelect: {
      fileSelection: "",
      type: "create",
      importText: undefined,
      editorText: "",
    },
  });

  const handleEditorChange = (text) => {
    setSessionData({...sessionData, sourceSelect: {...sessionData.sourceSelect, editorText: text}});
  }

  const handleSourceChange = (event) => {
    const target = event.target;
    const name = target.name;
    setSessionData({...sessionData, [name]: target.value});
  }

  const handleChange = (event) => {
    const target = event.target;
    if (target.name !== "sourceSelect")
      setSessionData({...sessionData, [target.name]: target.value });
    else {
      throw new Error(
        "Invalid state update: `handleChange` cannot update sourceSelect or nested data."
      );
    }
  }

  const validate = (state) => {
    if (SessionsCollection.find({ name: state.name }).fetch().length > 0)
      return "Session name already taken";
    else return "";
  }

  const submit = (event) => {
    // let state = this.state;
    event.preventDefault();
    const isImport = sessionData.sourceSelect.type === "import";
    const errorMsg = validate(sessionData);

    setSessionData({...sessionData, errorMsg});
    if (!errorMsg) {
      const template = isImport
        ? sessionData.sourceSelect.importText
        : sessionData.sourceSelect.editorText;
      SessionsCollection.insert({
        name: sessionData.name,
        instructions: {
          title: sessionData.title,
          description: sessionData.description,
        },
        template,
        users: [],
      });

      // TODO: implement routing to new session
      //contextProvider("submissions");
    }
  }

  const handleImport = (importEvent) => {
    let fileReader = new FileReader();
    fileReader.onload = (loadEvent) => {
      const text = loadEvent.target.result;
      setSessionData({...sessionData, sourceSelect: { ...sessionData.sourceSelect, importText: text }});
    };
    fileReader.readAsText(importEvent.target.files[0], "UTF-8");
  }


    return (
      <form className="sessionCreationForm">
        <h1>New session</h1>
        <div className="scf-entry">
          <label>
            <strong>Session name: </strong>
            <input
              type="text"
              name="name"
              value={sessionData.name}
              onChange={handleChange}
            ></input>
          </label>
        </div>
        <div className="scf-entry">
          <label>
            <strong>Session title: </strong>
            <input
              type="text"
              name="title"
              value={sessionData.title}
              onChange={handleChange}
            ></input>
          </label>
        </div>
        <div className="scf-entry">
          <label>
            <div>
              <strong>Session description: </strong>
            </div>
            <textarea
              type="text"
              name="description"
              value={sessionData.description}
              onChange={handleChange}
            ></textarea>
          </label>
        </div>
        <div className="scf-entry">
          <strong>Submission template: </strong>
          <div>
            <label>
              <input
                type="radio"
                name="type"
                value="create"
                checked={sessionData.sourceSelect.type === "create"}
                onChange={handleSourceChange}
              ></input>
              Write a new template
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="import"
                checked={sessionData.sourceSelect.type === "import"}
                onChange={handleImport}
              ></input>
              Import a template
            </label>
            <div>
              <p>
                Provide the name of the blank function with any helper
                constants.
              </p>
            </div>
          </div>
          <div className="template-entry">
            {sessionData.sourceSelect.type === "create" ? (
              <AceEditor
                mode="python"
                theme="github"
                name="editorText"
                setOptions={{
                  useSoftTabs: true,
                }}
                highlightActiveLine={false}
                height="300px"
                width="400px"
                value={sessionData.sourceSelect.editorText}
                onChange={handleEditorChange}
                debounceChangePeriod={1000}
                editorProps={{ $blockScrolling: true }}
              />
            ) : (
              <div>
                {sessionData.sourceSelect.importText != undefined && (
                  <AceEditor
                    mode="python"
                    theme="github"
                    name="editorText"
                    setOptions={{
                      useSoftTabs: true,
                    }}
                    highlightActiveLine={false}
                    height="300px"
                    width="400px"
                    value={sessionData.sourceSelect.importText}
                    readOnly={true}
                    editorProps={{ $blockScrolling: true }}
                  />
                )}

                <input
                  type="file"
                  onChange={this.handleImport}
                  accept=".py"
                ></input>
              </div>
            )}
          </div>
        </div>
        {sessionData.errorMsg && (
          <div>
            <p className="error-msg-body">{sessionData.errorMsg}</p>
          </div>
        )}
        <label>
          <input
            type="submit"
            value="submit"
            onClick={(event) => {
              submit(event);
            }}
          ></input>
        </label>
      </form>
    );
  }
