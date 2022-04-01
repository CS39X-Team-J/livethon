import React, { Component, useContext, useState } from "react";
import { SessionsCollection } from "../../../api/modules";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-python";
import { useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { SessionEditForm } from "./SessionEditForm";
import { updateSession } from "../../../api/methods/updateSession";

export const SessionEdit = () => {

    const params = useParams();

    const [loading, setLoading] = useState(true);
    const [sessionData, setSessionData] = useState({
        title: "",
        description: "",
        template: "",
    });


    useLayoutEffect(() => {
        // for editing an existing session, initialize state to session data once
        Meteor.subscribe('sessions', {
            onReady: () => {

                const session = SessionsCollection.findOne({ name: params.session });
                
                if (session) {
                    setSessionData({
                        title: session.instructions.title,
                        description: session.instructions.description,
                        template: session.template,               
                    });

                    setLoading(false);

                } else {
                    // if user tries to edit a nonexistent session, route to session create form
                    navigateTo('/instructor/session/create');
                }
            }
        });
    }, []);

    const handleChange = (key, value) => {
        setSessionData({ ...sessionData, [key]: value });
    }

    const submit = () => {

        updateSession.call({
            ...sessionData,
            name: params.session,
        }, (err, res) => {
            if (err) {
                alert(err);
            } else {
                alert("Session details changed successfully!");
            }
        });

    }

    if (loading) {

        return (<p>Loading....</p>);

    } else {
        
        return (
            <form className="sessionCreationForm">
                <SessionEditForm handleChange={handleChange} sessionData={sessionData} submit={submit} />
            </form>
        );

    }    

}
