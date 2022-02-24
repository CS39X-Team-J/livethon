import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { RunsCollection } from '../../api/modules';

export const ResultViewer = ({ module }) => {
    const run = useTracker(() => {
        return RunsCollection.findOne({ module: module._id }, { sort: { createdAt: -1 } });
    });

    console.log(run.output)

    return <div className="output">
        <div>{(run && run.createdAt.getTime() == module.createdAt.getTime()) ? run.output.toString() : "Processing..."}</div>
    </div>;
}