export class TestCase {

    constructor({ description }) {
        this.description = description;
    }

}

// should only be used when the test cannot be implemented with FunctionTestCase,
// since there is less information accessible for frontend display
// example: you want to assert that a function with a certain name exists in code
export class GeneralTestCase extends TestCase {

    constructor({ description, code }) {
        super({ description });
        this.code = code;
    }

}

// for simple input and expected output tests
export class FunctionTestCase extends TestCase {

    constructor({ description, targetFunction, input, expectedOutput }) {
        super({ description });
        this.targetFunction = targetFunction;
        this.input = input;
        this.expectedOutput = expectedOutput;
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
    
    // return output of function given specific input
    if (test instanceof FunctionTestCase) {
        
        const wrappedCode = code + `
            ${test.targetFunction}(${test.input})
        `;

        return pool.requestCompilation({ code: wrappedCode, id: module })

    } else if (test instanceof GeneralTestCase) {
        // 
        const wrappedCode = code + test.code;
        
        return pool.requestCompilation({ code: wrappedCode, id: module });

    } else {
        throw new Error("Test must extend TestCase class");
    }

}