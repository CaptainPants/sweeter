import { MutableValueSignal } from './internal/MutableValueSignal.js';
import { type ReadWriteSignal } from './types.js';

export function $mutable<T>(initialValue: T): ReadWriteSignal<T> & { value: T };
export function $mutable<TOrUndefined>(): ReadWriteSignal<
    TOrUndefined | undefined
> & { value: TOrUndefined extends undefined ? never : TOrUndefined };
export function $mutable<T>(
    initialValue?: T,
): ReadWriteSignal<T> & { value: T } {
    return new MutableValueSignal<T>(initialValue as T);
}
