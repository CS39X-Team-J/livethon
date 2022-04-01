import React from "react";
import { Fragment } from "react/cjs/react.production.min";
import { useTracker } from "meteor/react-meteor-data";
import { useParams } from "react-router-dom";
import { ModulesCollection } from "../../../api/modules";
import { Solution } from "../../components/Solution";

export const SessionView = () => {

    const params = useParams();

    const modules = useTracker(() => {
        console.log(params.session)
        const subscription = Meteor.subscribe('modules', params.session);
        if (!subscription.ready()) {
          return [];
        }
        
        return ModulesCollection.find({
          session: params.session
        }).fetch();
    
    });


    return (

        <Fragment>
            
            <div className="SolutionContainer">
                
                {modules.map((module) => {
                    return (
                        <Solution module={module} key={module._id}></Solution>
                    );
                })}

            </div>

        </Fragment>

    );

};