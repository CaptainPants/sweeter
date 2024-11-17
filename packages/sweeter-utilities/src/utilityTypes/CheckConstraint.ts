
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is intended to be used in a constraint and the default value of TResult should pass for all types
export type CheckConstraint<T extends boolean, TResult = any> = T extends true
    ? TResult
    : { error: "Constraint check failed" };
