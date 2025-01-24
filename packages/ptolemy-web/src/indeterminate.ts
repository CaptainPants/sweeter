export const indeterminite: unique symbol = Symbol('indeterminite');

export type ThreeValueBoolean = boolean | typeof indeterminite;
