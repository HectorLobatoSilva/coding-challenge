class Logger {
    #logs = [];
    #logSources = [];
    #printer;
    // Logs type = {
    //     date: Date,
    //     msg: string,
    //     source: Object
    // }
    constructor(logsSources = [], printer, isAsync = false) {
        this.#logSources = isAsync ? logsSources : null;
        this.#printer = printer;
        for (let i = 0, len = logsSources.length; i < len; i++) {
            this.#logs.push({
                ...logsSources[i].last,
                source: logsSources[i],
            });
        }
        this.#logs.sort((prev, next) => Number(prev.date) - Number(next.date));
    }

    printSyncLogs() {
        while (this.#logs.length) {
            const current = this.#logs.shift();
            const value = current.source.pop();
            if (value) {
                this.insert({
                    ...value,
                    source: current.source,
                });
            }
            const { date, msg } = current;
            this.#printer.print({ date, msg });
        }
    }

    async printAsyncLogs() {
        while (this.#logs.length) {
            if (!this.#logSources.length) return;
            this.#logSources = this.#logSources.filter(
                (logSource) => !logSource.drained
            );
            const promises = this.#logSources.map((logSource) =>
                logSource.popAsync()
            );
            let values = await Promise.all(promises);
            values = values.filter(Boolean);
            for (let i = 0, len = values.length; i < len; i++) {
                this.insert(values[i]);
            }
            this.#printer.print(this.#logs.shift());
        }
    }

    insert(newLog) {
        const index = this.binarySearch(Number(newLog.date));
        this.#logs.splice(index, 0, newLog);
    }

    binarySearch(date) {
        let min = 0;
        let max = this.#logs.length;
        while (min < max) {
            let middle = (min + max) >>> 1;
            const d = Number(this.#logs[middle].date);
            if (Number(this.#logs[middle].date) < date) {
                min = middle + 1;
            } else {
                max = middle;
            }
        }
        return min;
    }
}

module.exports = Logger;
