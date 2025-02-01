// Note that these are intentionally not symbols so that its relatively easy to check if an object
// is a signal from another library.
export const PTOLEMY_IS_SIGNAL = Symbol.for('PTOLEMY_IS_SIGNAL');
export const PTOLEMY_IS_WRITABLE_SIGNAL = Symbol.for('PTOLEMY_IS_WRITABLE_SIGNAL');
export const PTOLEMY_IS_CONSTANT_SIGNAL = Symbol.for('PTOLEMY_IS_CONSTANT_SIGNAL');
