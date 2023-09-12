import { expect } from '@jest/globals';

import { calc, mutable } from '.';
import { SignalState } from './SignalState';

it('CalculatedSignal listeners invoked with correct value after dependency updated', () => {
    const mutableSignal = mutable(1);
    const calculatedSignal = calc(() => mutableSignal.value + 1);

    let prevStored: SignalState<number> | undefined;
    let nextStored: SignalState<number> | undefined;

    calculatedSignal.listen((prev, next) => {
        prevStored = prev;
        nextStored = next;
    });

    mutableSignal.update(2);

    expect(prevStored).toEqual({
        mode: 'SUCCESS',
        value: 2,
    } satisfies SignalState<number>);
    expect(nextStored).toEqual({
        mode: 'SUCCESS',
        value: 3,
    } satisfies SignalState<number>);
});
