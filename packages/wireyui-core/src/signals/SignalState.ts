export type SignalState<T> =
    | { readonly mode: 'SUCCESS'; readonly value: T }
    | { readonly mode: 'ERROR'; readonly error: unknown };
