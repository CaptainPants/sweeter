/* eslint-disable @typescript-eslint/no-explicit-any */
export {}

(Symbol as any).dispose ??= Symbol("Symbol.dispose");
(Symbol as any).asyncDispose ??= Symbol("Symbol.asyncDispose");
