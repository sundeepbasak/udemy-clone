"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaginationData = void 0;
function generatePaginationData(data, batchSize) {
    var row_count = data.length;
    var iters = Math.ceil(row_count / batchSize);
    var batches = [];
    for (var i = 0; i < iters; i++) {
        var pageNum = i;
        var startInd = i * batchSize;
        var endInd = Math.min(i * batchSize + batchSize, data.length);
        batches.push({
            pageNum: pageNum,
            records: Math.min(batchSize, endInd - startInd),
            startInd: startInd,
            endInd: endInd,
            slice: data.slice(startInd, endInd)
        });
    }
    return { iters: iters, batches: batches };
}
exports.generatePaginationData = generatePaginationData;
