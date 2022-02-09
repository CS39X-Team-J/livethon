export class WebWorkerPool {

    constructor(poolSize = 3, timeout = 1) {
        this.poolSize = poolSize;
        this.timeout = timeout;
        this.reset();
    }

    reset() {
        this.requests = new Map();
        this.idleWorkers = new Set();
        this.workerToRequest = new Map();
        this.requestQueue = [];
        this.setupWorkers();
    }

    setupWorkers() {
        this.workers = [];
        for (let index = 0; index < this.poolSize; index++) {
            let worker = new Worker('/py-runner.js');
            
            worker.onmessage = (e) => {
                this.masterListener(index, e.data);
            }

            this.workers.push({ 
                worker,
                timer: null,
            });
        }
    }

    handleRequest({ code, id }) {
        // send to web worker pool
        if (this.idleWorkers.size > 0) {
            const idleWorker = this.idleWorkers.values().next();
            this.startJob(idleWorker.value, { code, id });            
        } else {
            this.requestQueue.push({ code, id });
        }
    }

    // returns a promise that resolves when compilation results are finished
    // or a timeout occurred
    requestCompilation({ code, id }) {
        const that = this;
        let promise = new Promise(function(resolve, reject) {
            // store the resolve function so we can resolve this promise later
            // when the output arrives or a timeout occurs
            that.requests.set(id, {
                resolve,
                reject,
            });
        });

        this.handleRequest({ code, id });

        return promise;
    }

    masterListener(workerID, message) {
        // if worker is ready, set to idle unless request queue is full
        if (message == "ready") {
            console.log(`Worker ${workerID} is ready!`);
            this.onEventWorkerReady(workerID);

            if (this.requestQueue.length > 0) {
                this.startJob(workerID, this.requestQueue.shift());
            }

        } else if (message.id != undefined) {
            // python output is returned, resolve appropriate promise
            this.requests.get(message.id).resolve(message);
            clearTimeout(this.workers[workerID].timer);
        }
    }

    // assumes worker of workerID is idle
    // removes from idleWorkers set and starts job
    startJob(workerID, {code, id}) {
        console.log(`Worker ${workerID} assigned job`);
        this.workerToRequest.set(workerID, id);
        this.workers[workerID] = {
            timer: setTimeout(() => { this.onWorkerTimeout(workerID) }, this.timeout*1000),
            worker: this.workers[workerID].worker, 
        }

        this.workers[workerID].worker.postMessage({ code, id });
        if (!this.idleWorkers.delete(workerID)) {
            console.warn("a non idle worker has been assigned a task.");
        }
    }

    // adds workerID to idleWorkers list
    onEventWorkerReady(workerID) {
        this.idleWorkers.add(workerID);
    }

    // restart web worker and re assign onmessage to masterListener
    onWorkerTimeout(workerID) {
        //console.warn(`Timeout occurred for worker ${workerID}`)
        // terminate and reset web worker on suspected infinite loop
        console.warn(`Timeout: Restarting worker ${workerID}`);
        this.workers[workerID].worker.terminate();
        this.workers[workerID].worker = new Worker('/py-runner.js');
        this.workers[workerID].worker.onmessage = (e) => {
            this.masterListener(workerID, e.data);
        }

        // resolve awaited output with timeout error message
        this.requests.get(this.workerToRequest.get(workerID)).reject(`Timeout: Code took longer than ${this.timeout} second(s) to complete`);
    }

}