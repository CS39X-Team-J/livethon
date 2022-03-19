import { createRun } from "../../api/methods/createRun";

export const execute = async ({ moduleID, code, pool, createdAt }) => {
    
    let output;

    try {
        const results = await pool.requestCompilation({ code, id: moduleID });
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