import React from "react";
import { Fragment } from "react/cjs/react.production.min";
import { useTracker } from "meteor/react-meteor-data";
import { useParams } from "react-router-dom";
import { Solution } from "../../../components/Solution";
import { ModulesCollection } from "../../../../api/modules";

export const SessionView = () => {

    const params = useParams();

    const modules = useTracker(() => {
        
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