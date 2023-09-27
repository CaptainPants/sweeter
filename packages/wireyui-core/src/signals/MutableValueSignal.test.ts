import { expect } from '@jest/globals';

import { mutable } from './MutableValueSignal.js';
import { SignalState } from './SignalState.js';

it('MutableValueSignal has initial value', () => {
    const signal = mutable(23);

    const value = signal.value;

    expect(value).toStrictEqual(23);
});

it('MutableValueSignal listeners invoked with correct value after update', () => {
    const signal = mutable(1);

    let prevStored: SignalState<number> | undefined;
    let nextStored: SignalState<number> | undefined;

    signal.listen((prev, next) => {
        prevStored = prev;
        nextStored = next;
    });

    signal.value = 2;

    expect(prevStored).toEqual({
        mode: 'SUCCESS',
        value: 1,
    } satisfies SignalState<number>);
    expect(nextStored).toEqual({
        mode: 'SUCCESS',
        value: 2,
    } satisfies SignalState<number>);
});