import crypto from 'crypto';

export const BYTE_ORDER_BE = 0;
export const BYTE_ORDER_LE = 1;

/**
 * convert a number to a buffer with specified length in specified byte order
 * @param num
 * @param len
 * @param byteOrder
 * @returns {Buffer}
 */
export function numberToBuffer(num, len = 2, byteOrder = BYTE_ORDER_BE) {
  if (len < 1) {
    throw Error('len must be greater than 0');
  }

  const isOutOfRange = num > parseInt(`0x${'ff'.repeat(len)}`);
  if (isOutOfRange) {
    throw Error(`Number ${num} is too big to put into a ${len} byte(s) size buffer`);
  }

  const buf = Buffer.alloc(len);
  if (byteOrder === BYTE_ORDER_BE) {
    buf.writeUIntBE(num, 0, len);
  } else {
    buf.writeUIntLE(num, 0, len);
  }
  return buf;
}

/**
 * returns a random integer in [min, max].
 * @param min
 * @param max
 * @returns {Number}
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.ceil(max);
  return Math.floor(crypto.randomBytes(1)[0] / 0xff * (max - min + 1)) + min;
}

/**
 * split buffer into chunks, each chunk size is picked randomly from [min, max]
 * @param buffer
 * @param min
 * @param max
 * @returns {Array<Buffer>}
 */
export function getRandomChunks(buffer, min, max) {
  const totalLen = buffer.length;
  const bufs = [];
  let ptr = 0;
  while (ptr < totalLen - 1) {
    const offset = getRandomInt(min, max);
    bufs.push(buffer.slice(ptr, ptr + offset));
    ptr += offset;
  }
  if (ptr < totalLen) {
    bufs.push(buffer.slice(ptr));
  }
  return bufs;
}

/**
 * split buffer into chunks, the max chunk size is maxSize
 * @param buffer
 * @param maxSize
 * @returns {Array<Buffer>}
 */
export function getChunks(buffer, maxSize) {
  const totalLen = buffer.length;
  const bufs = [];
  let ptr = 0;
  while (ptr < totalLen - 1) {
    bufs.push(buffer.slice(ptr, ptr + maxSize));
    ptr += maxSize;
  }
  if (ptr < totalLen) {
    bufs.push(buffer.slice(ptr));
  }
  return bufs;
}

/**
 * generate random id from [0, max - 1] but exclude ids
 * @param ids
 * @param max
 * @returns {Number}
 */
export function generateMutexId(ids = [], max = 0xff) {
  const seqArr = Array.from(new Array(max).keys());
  for (let i = 0; i < ids.length; ++i) {
    seqArr.splice(ids[i] - i, 1);
  }
  if (seqArr.length > 0) {
    return seqArr[crypto.randomBytes(1)[0] % seqArr.length];
  } else {
    return -1;
  }
}
