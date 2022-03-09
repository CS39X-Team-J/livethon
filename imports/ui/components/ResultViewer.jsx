import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { RunsCollection } from '../../api/modules';

export const ResultViewer = ({ moduleID, createdAt }) => {
    
    const run = useTracker(() => {
        Meteor.subscribe('runs');
        return RunsCollection.findOne({ module: moduleID, createdAt });
    });

    return <div className="output">
        <div>{run ? run.output.toString() : 'Processing...'}</div>
    </div>;
}