import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { TestsCollection } from "../../../../api/modules";
import { TestCaseTypes } from "../../../../api/execute";
import { InputOutputTest } from "./InputOutputTest";
import { GeneralTest } from "./GeneralTest";

const VERSIONS = {
  PUBLISHED: "published",
  DRAFT: "draft",
}

export const TestCaseComponent = ({ testData, onChange, onRemove, onPublish }) => {

  const [versionSelected, setVersionSelected] = useState(VERSIONS.DRAFT);
  const [selectedData, setSelectedData] = useState(null);

  const handleChange = ({ newDraft }) => {
    if (versionSelected === VERSIONS.DRAFT) {
      onChange({
        testData,
        newDraft,
      })
    }
  }

  const toggleVersion = () => {
    setVersionSelected(versionSelected === VERSIONS.PUBLISHED ? VERSIONS.DRAFT : VERSIONS.PUBLISHED);
  }

  const deleteTest = () => {
    onRemove({ testID: testData._id });
  }

  const publishTest = () => {
    onPublish({ testData });
  }

  useEffect(() => {
    setSelectedData(versionSelected === VERSIONS.PUBLISHED ? testData.test.publish : testData.test.draft);
  }, [versionSelected]);

  return (

    <div className="TestCaseComponent">
      
      <div className="header">
        
        <h2>{`Version: ${versionSelected} Type: ${selectedData?.type }`}</h2>
        
        <p>{ selectedData ? selectedData.description : null }</p>

        <button onClick={toggleVersion}>Toggle Version</button>
        <button onClick={deleteTest}>Delete</button>
        { versionSelected === VERSIONS.DRAFT ? (<button onClick={publishTest}>Publish</button>) : null }

      </div>

      {
        selectedData ? 
        (selectedData.type == TestCaseTypes.GENERAL ? 
          (<GeneralTest test={selectedData} onChange={handleChange} />) : 
          (<InputOutputTest test={selectedData} onChange={handleChange} />)) 
        : null
      }

    </div>
  );

};
