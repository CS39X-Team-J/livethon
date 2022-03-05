import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { RunsCollection } from '../../api/modules';

export const ResultViewer = ({ module }) => {
    
    const run = useTracker(() => {
        const subscription = Meteor.subscribe('runs')
        if (subscription.ready()) {
            return RunsCollection.findOne({ module: module._id, createdAt: module.createdAt });
        }        
    });

    return <div className="output">
        <div>{run ? run.output.toString() : `Processing...`}</div>
    </div>;
}