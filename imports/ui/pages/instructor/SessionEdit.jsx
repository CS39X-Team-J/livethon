import React, { useState } from "react";
import AceEditor from "react-ace";
import { SessionsCollection } from "../../../api/modules";
import { useTracker } from "meteor/react-meteor-data";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-python";
import { useNavigate, useParams } from "react-router-dom";

export const SessionEdit = ({ isNew }) => {

    const params = useParams();

    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [fileSelection, setFileSelection] = useState("");
    const [type, setType] = useState("create");
    const [importText, setImportText] = useState(undefined);
    const [editorText, setEditorText] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const sessionData = useTracker(() => {
        
        if (!isNew) {
            
            const subscription = Meteor.subscribe('sessions');
            const session = SessionsCollection.findOne({ name: params.session });

            if (!subscription.ready()) {
                return {
                    isReady: false,
                };
            }

            if (session) {
                return { ...session, isReady: true }; 
            } else {
                return {
                    doesNotExist: true,
                }
            }

        } else {
            return {
                isReady: true,
                name: "",
                title: "",
                description: "",
                template: "",
            }
        }

    });

    let navigate = useNavigate();

    const navigateTo = (path) => {
        navigate(path)
    }

    const validate = () => {
        if (SessionsCollection.find({ name: name }).fetch().length > 0)
            return "Session name already taken";
        else return "";
    }

    const submit = () => {

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
        sessionData.isReady ? 
        (
            <form className="sessionCreationForm">
            <h1>{ isNew ? "Create Session" : `Edit ${name}`}</h1>
            <div className="scf-entry">
                <label>
                    <strong>Session name: </strong>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={setName}
                    ></input>
                </label>
            </div>
            <div className="scf-entry">
                <label>
                    <strong>Session title: </strong>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={setTitle}
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
                        value={description}
                        onChange={setDescription}
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
                            value={editorText}
                            onChange={setEditorText}
                            debounceChangePeriod={1000}
                            editorProps={{ $blockScrolling: true }}
                        />
                    ) : (
                        <div>
                            {importText != undefined && (
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
                                    value={importText}
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
            {errorMsg && (
                <div>
                    <p className="error-msg-body">{errorMsg}</p>
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
        ) : (sessionData.doesNotExist ? (<h1>Session does not exist</h1>) :
        (
            <h1>Loading</h1>
        ))
        
    );
}
