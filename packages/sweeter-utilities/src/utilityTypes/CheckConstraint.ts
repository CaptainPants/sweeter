
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Default value for TResult as this is intended to be used in form T extends Check<CONDITION> and any is used as something that everything extends
export type CheckConstraint<T extends boolean, TResult = any> = T extends true
    ? TResult
    : { error: "Constraint check failed" };
