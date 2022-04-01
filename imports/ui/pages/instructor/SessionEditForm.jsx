import React, { useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-python";
import { useParams } from "react-router-dom";

export const SessionEditForm = ({ sessionData, handleChange, submit }) => {

    const params = useParams();

    const [type, setType] = useState("create");
    const [importText, setImportText] = useState("");
    const [editorText, setEditorText] = useState("");

    const getTemplate = () => {
        return sessionData.sourceSelect.type === 'import'
            ? sessionData.sourceSelect.importText
            : sessionData.sourceSelect.editorText;
    }

    const changeValue = (e) => {

        const key = e.target.name;
        const newValue = e.target.value;

        handleChange(key, newValue);

    }

    const handleImport = (importEvent) => {
        let fileReader = new FileReader();
        fileReader.onload = (loadEvent) => {
            const text = loadEvent.target.result;
            setImportText(text);
        };
        fileReader.readAsText(importEvent.target.files[0], "UTF-8");
    }

    return (
        <div>
            <div className="scf-entry">
                <label>
                    <strong>Session title: </strong>
                    <input
                        type="text"
                        name="title"
                        value={sessionData.title}
                        onChange={changeValue}
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
                        onChange={changeValue}
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
                            checked={type === "create"}
                            onChange={() => { setType("create"); }}
                        ></input>
                        Write a new template
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="type"
                            value="import"
                            checked={type === "import"}
                            onChange={() => { setType("import"); }}
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
                    {type === "create" ? (
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
                            value={sessionData.template}
                            onChange={(val) => { handleChange("template", val); }}
                            debounceChangePeriod={1000}
                            editorProps={{ $blockScrolling: true }}
                        />
                    ) : (
                        <div>
                            {sessionData.template != undefined && (
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
                                    value={sessionData.template}
                                    readOnly={true}
                                    editorProps={{ $blockScrolling: true }}
                                />
                            )}

                            <input
                                type="file"
                                onChange={handleImport}
                                accept=".py"
                            ></input>
                        </div>
                    )}
                </div>
            </div>
            <button onClick={(e) => {
                e.preventDefault();
                submit();
            }}>Submit</button>
        </div>


    );
}
