"use strict";
// const _ = require('lodash');
const Logger = require("./logger.class");

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
    const logger = new Logger(logSources, printer);
    logger.printSyncLogs();
    printer.done();
    return console.log("Sync sort complete.");
};
