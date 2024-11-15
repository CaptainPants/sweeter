
export type CheckConstraint<T extends boolean, TResult = any> = T extends true ? TResult : never;