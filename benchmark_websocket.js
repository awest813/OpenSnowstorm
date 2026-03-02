const { performance } = require('perf_hooks');
const { Blob } = require('buffer');

const generateBatch = (numMsgs, msgSize) => {
  const batch = [];
  for (let i = 0; i < numMsgs; i++) {
    batch.push(new Uint8Array(msgSize));
  }
  return batch;
};

const runOriginal = (batch) => {
  if (!batch.length) return;
  const header = new Uint8Array(3);
  header[0] = 0;
  header[1] = (batch.length & 0xFF);
  header[2] = batch.length >> 8;
  return new Blob([header, ...batch]);
};

const runOptimized1 = (batch, batchSize) => {
  if (!batch.length) return;
  const buffer = new Uint8Array(batchSize + 3);
  buffer[0] = 0;
  buffer[1] = (batch.length & 0xFF);
  buffer[2] = batch.length >> 8;
  let pos = 3;
  for (let i = 0; i < batch.length; i++) {
    const msg = batch[i];
    buffer.set(msg, pos);
    pos += msg.byteLength;
  }
  return buffer;
};

const numBatches = 10000;
const msgsPerBatch = 100;
const msgSize = 64;

// pre-generate batches
const batches = [];
let totalBatchSize = 0;
for (let i = 0; i < numBatches; i++) {
  const b = generateBatch(msgsPerBatch, msgSize);
  batches.push(b);
}
totalBatchSize = msgsPerBatch * msgSize;


// Run original (Blob)
let start = performance.now();
for (let i = 0; i < numBatches; i++) {
  runOriginal(batches[i]);
}
let end = performance.now();
console.log(`Blob-based original: ${end - start} ms`);

// Run optimized (already tracking batchSize)
start = performance.now();
for (let i = 0; i < numBatches; i++) {
  runOptimized1(batches[i], totalBatchSize);
}
end = performance.now();
console.log(`Optimized (Uint8Array pre-allocation): ${end - start} ms`);
