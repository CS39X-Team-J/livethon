import React from "react";
import { useParams } from "react-router-dom";
import { GeneralTestCase, InputOutputTestCase, TestCaseData } from "../../../../api/execute";
import { TestCaseComponent } from "./TestCaseComponent";
import { useTracker } from "meteor/react-meteor-data";
import { TestsCollection } from "../../../../api/modules";
import { createTestCase } from "../../../../api/methods/createTestCase";
import { updateTestCase } from "../../../../api/methods/updateTestCase";
import { removeTestCase } from "../../../../api/methods/removeTestCase";

const handleResponse = (err, res) => {
  if (err) {
    alert(err);
  }
}

export const TestsEdit = () => {

  const params = useParams();

  const { isReady, testCaseData } = useTracker(() => {
    
    const subscription = Meteor.subscribe('tests', params.session);
    const testCaseData = TestsCollection.find().fetch();
    
    return {
      isReady: subscription.ready(),
      testCaseData,
    }

  });

  // copy draft to published
  const publishDraft = ({ testID, draft }) => {

    const createdAt = new Date();
    const updatedData = new TestCaseData({ published: draft, draft });

    updateTestCase.call({
      testID,
      test: updatedData,
      createdAt,
    }, handleResponse);

  }

  // create new test
  const addNewTest = ({ newData }) => {

    const createdAt = new Date();

    createTestCase.call({
      test: newData,
      session: params.session,
      createdAt,
    }, handleResponse);

  }

  const addGeneralTestCase = () => {
    const newTestCase = new GeneralTestCase({ description: "", code: "" });
    const newData = new TestCaseData({ published: null, draft: newTestCase });
    addNewTest({ newData });
  }

  const addInputOutputTestCase = () => {
    const newTestCase = new InputOutputTestCase({ description: "", targetFunction: "", expectedOutput: "" });
    const newData = new TestCaseData({ published: null, draft: newTestCase });
    addNewTest({ newData });
  }

  const saveDraft = ({ testID, newDraft }) => {
    
    const selectedTest = (testData.filter(test => test._id == testID))[0];
    const published = selectedTest.test.published;
    const updatedData = new TestCaseData({ published, draft: newDraft });

    updateTestCase.call({
      testID,
      test: updatedData,
      createdAt,
    }, handleResponse);

  }


  const handleRemove = ({ testID }) => {
    removeTestCase.call({ testID }, handleResponse);
  }

  return (

    <div className="TestsView">

      <div className="tools">
        <button onClick={addGeneralTestCase}>Add General Test Case</button>
        <button onClick={addInputOutputTestCase}>Add Input Output Test Case</button>
      </div>

      <div className="TestCases">

      </div>
      {isReady ? testCaseData.map((testData) => {
        return (
          <TestCaseComponent test={testData} onChange={saveDraft} onRemove={handleRemove} onPublish={publishDraft}/>
        );
      }) : (
        <p>Loading...</p>
      )}
    </div>
  );

};
