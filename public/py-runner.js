// https://pyodide.readthedocs.io/en/latest/usage/webworker.html

// Setup your project to serve `py-worker.js`. You should also serve
// `pyodide.js`, and all its associated `.asm.js`, `.data`, `.json`,
// and `.wasm` files as well:
self.languagePluginUrl = 'https://cdn.jsdelivr.net/pyodide/v0.16.1/full/';
importScripts('https://cdn.jsdelivr.net/pyodide/v0.16.1/full/pyodide.js');

let pythonLoading;
async function loadPythonPackages(){
    await languagePluginLoader;
    pythonLoading = self.pyodide.loadPackage(['numpy', 'pytz']);
}

const listener = async (event) => {
    //self.postMessage(event.data);
    // Don't bother yet with this line, suppose our API is built in such a way:
    const {code, id} = event.data;
    // The worker copies the context in its own "memory" (an object mapping name to values)
    // for (const key of Object.keys(context)){
    //     self[key] = context[key];
    // }

    // The reason we can't use await here is that it allows multiple compilations
    // to run with their runPython functions intermixed. Removing await fixed issues of stdout leak
    self.pyodide.runPython(`
        import io, sys
        sys.stdout = io.StringIO()
    `)

    // Now is the easy part, the one that is similar to working in the main thread:
    try {
        let results = self.pyodide.runPython(code);
        let stdout = self.pyodide.runPython("sys.stdout.getvalue()")
        self.postMessage({
            results, stdout, id
        });
        
        
    }
    catch (error){
        self.postMessage(
            {error : error.message, id}
        );
    }

    self.postMessage("ready");

}

const main = async () => {
    await languagePluginLoader;
    await pythonLoading;
    self.postMessage("ready");
    self.onmessage = listener;
}

main();