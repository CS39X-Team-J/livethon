import React from "react";
import { useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { TestsCollection } from "../../../../api/modules";

export const TestCaseComponent = ({ test }) => {

  const params = useParams();

  const { isReady, tests } = useTracker(() => {
    const subscription = Meteor.subscribe('tests', params.session);
    const tests = TestsCollection.find().fetch();
    return { isReady: subscription.ready(), tests: tests };
  });

  console.log(test)

  return (

    <div className="TestCaseComponent">
      {test.description}
        <input></input>
    </div>
  );

};
