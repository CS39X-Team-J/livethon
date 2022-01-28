import React, { useContext, useState, Component } from "react";
import AceEditor from "react-ace";
import { SessionsCollection } from "../../../api/modules";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-python";
import { InstructorViewContext } from "./InstructorView";

export class SessionCreationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };

    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleImport = this.handleImport.bind(this);
  }

  handleEditorChange(text) {
    this.setState((state) => {
      return {
        sourceSelect: { ...state.sourceSelect, editorText: text },
      };
    });
  }

  handleSourceChange(event) {
    const target = event.target;
    const name = target.name;
    this.setState((state) => {
      return { sourceSelect: { ...state.sourceSelect, [name]: target.value } };
    });
  }

  handleChange(event) {
    const target = event.target;
    if (target.name !== "sourceSelect")
      this.setState({
        [target.name]: target.value,
      });
    else {
      throw new Error(
        "Invalid state update: `handleChange` cannot update sourceSelect or nested data."
      );
    }
  }

  validate(state) {
    if (SessionsCollection.find({ name: state.name }).fetch().length > 0)
      return "Session name already taken";
    else return "";
  }

  submit(event) {
    let state = this.state
    event.preventDefault();
    const isImport = state.sourceSelect.type === "import";
    const errorMsg = this.validate(state);
    if (errorMsg) {
      this.setState({ errorMsg });
    } else {
      this.setState({ errorMsg: "" });
      const template = isImport
        ? state.sourceSelect.importText
        : state.sourceSelect.editorText;
      SessionsCollection.insert({
        name: state.name,
        instructions: {
          title: state.title,
          description: state.description,
        },
        template,
      });
      const { selectView } = useContext(InstructorViewContext);
      selectView("submissions");
    }
  }

  handleImport(importEvent) {
    let fileReader = new FileReader();
    fileReader.onload = (loadEvent) => {
      const text = loadEvent.target.result;
      console.log(text);
      this.setState((state) => {
        return {
          sourceSelect: { ...state.sourceSelect, importText: text },
        };
      });
    };
    fileReader.readAsText(importEvent.target.files[0], "UTF-8");
  }

  render() {
    return (
      <form className="sessionCreationForm">
        <h1>New session</h1>
        <div className="scf-entry">
          <label>
            <strong>Session name: </strong>
            <input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            ></input>
          </label>
        </div>
        <div className="scf-entry">
          <label>
            <strong>Session title: </strong>
            <input
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
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
              value={this.state.description}
              onChange={this.handleChange}
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
                checked={this.state.sourceSelect.type === "create"}
                onChange={this.handleSourceChange}
              ></input>
              Write a new template
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="import"
                checked={this.state.sourceSelect.type === "import"}
                onChange={this.handleSourceChange}
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
            {this.state.sourceSelect.type === "create" ? (
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
                value={this.state.sourceSelect.editorText}
                onChange={this.handleEditorChange}
                debounceChangePeriod={1000}
                editorProps={{ $blockScrolling: true }}
              />
            ) : (
              <div>
                {this.state.sourceSelect.importText != undefined && (
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
                    value={this.state.sourceSelect.importText}
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
        {this.state.errorMsg && (
          <div>
            <p className="error-msg-body">{this.state.errorMsg}</p>
          </div>
        )}
        <label>
          <input
            type="submit"
            value="submit"
            onClick={(event) => {
              this.submit(event);
            }}
          ></input>
        </label>
      </form>
    );
  }
}
