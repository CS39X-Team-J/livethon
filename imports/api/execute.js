export const TestCaseTypes = {
    GENERAL: "general",
    INPUTOUTPUT: "inputoutput",
}

export class TestCase {

    constructor({ description, type }) {
        this.description = description;
        this.type = type;
    }

}

// should only be used when the test cannot be implemented with FunctionTestCase,
// since there is less information accessible for frontend display
// example: you want to assert that a function with a certain name exists in code
export class GeneralTestCase extends TestCase {

    constructor({ description, code }) {
        super({ description, type: TestCaseTypes.GENERAL });
        this.code = code;
    }

}

// for simple input and expected output tests
export class InputOutputTestCase extends TestCase {

    constructor({ description, targetFunction, input, expectedOutput }) {
        super({ description, type: TestCaseTypes.INPUTOUTPUT });
        this.targetFunction = targetFunction;
        this.expectedOutput = expectedOutput;
        this.input = input;
    }

}

// storing both the published version and draft version
// allows the instructor to edit and save work on a test case that may or may not be
// it also makes syncing state between react and meteor easy 👌
export class TestCaseData {
    
    constructor({ published, draft }) {
        this.published = published;
        this.draft = draft;
    }

}

// run code and return stdout to simulate the console output
export const runCode = ({ pool, code, module }) => {

    const wrappedCode = `
        import io, sys
        sys.stdout = io.StringIO()
    ` + code + `
        sys.stdout.getvalue()
    `;

    return pool.requestCompilation({ code: wrappedCode, id: module });

}

// run test cases and get results
export const runTest = ({ pool, code, module, test }) => {
    
    if (test instanceof InputOutputTestCase) {
        // return output of function given specific input
        const wrappedCode = code + `
            ${test.targetFunction}(${test.input})
        `;

        return pool.requestCompilation({ code: wrappedCode, id: module })

    } else if (test instanceof GeneralTestCase) {
        // expect code to return true if passed, else false
        const wrappedCode = code + test.code;
        
        return pool.requestCompilation({ code: wrappedCode, id: module });

    } else {
        throw new Error("Test must extend TestCase class");
    }

}