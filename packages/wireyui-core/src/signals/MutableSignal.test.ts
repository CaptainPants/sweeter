import { expect } from '@jest/globals';

import { mutable } from '.';
import { SignalState } from './SignalState';

it('MutableSignal listeners invoked with correct value after update', () => {
    const signal = mutable(1);

    let prevStored: SignalState<number> | undefined;
    let nextStored: SignalState<number> | undefined;

    signal.listen((prev, next) => {
        prevStored = prev;
        nextStored = next;
    });

    signal.update(2);

    expect(prevStored).toEqual({
        mode: 'SUCCESS',
        value: 1,
    } satisfies SignalState<number>);
    expect(nextStored).toEqual({
        mode: 'SUCCESS',
        value: 2,
    } satisfies SignalState<number>);
});
