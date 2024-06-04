export function generatePaginationData<T>(data: T[], batchSize: number) {
    const row_count = data.length
    const iters = Math.ceil(row_count / batchSize);

    const batches: {
        pageNum: number;
        records: number;
        startInd: number;
        endInd: number;
        slice: T[]
    }[] = [];

    for (let i = 0; i < iters; i++) {
        const pageNum = i;
        const startInd = i * batchSize;
        const endInd = Math.min(i * batchSize + batchSize, data.length);

        batches.push({
            pageNum,
            records: Math.min(batchSize, endInd - startInd),
            startInd,
            endInd,
            slice: data.slice(startInd, endInd)
        })
    }
    return { iters, batches }
}