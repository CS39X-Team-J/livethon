import { createRun } from "../../api/methods/createRun";

export const execute = async (moduleID, code, request, createdAt) => {
    console.log("marker")
    let output;
    try {
        const results = await request({ id: moduleID, code });
        output = results.error ? results.error : results.stdout;
    } catch (e) {
        output = e;
    }

    createRun.call({
        moduleID,
        input: code,
        output,
        createdAt,
    });

    return output;
}