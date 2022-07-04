"use strict";
const Logger = require("./logger.class");
// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
    const logger = new Logger(logSources, printer, true);
    await logger.printAsyncLogs();
    printer.done();
    return console.log("Async sort complete.");
};
