import React from "react";

export const InputOutputTest = ({ test, onChange }) => {

    return (

        <div className="TestCase">

            <label>Target Function</label>
            <input
                type="text"
                value={test.targetFunction}
            ></input>

            <label>Input</label>
            <input
                type="text"
                value={test.input}
            ></input>

            <label>Expected Output</label>
            <input
                type="text"
                value={test.expectedOutput}
            ></input>

        </div>

    );

};
