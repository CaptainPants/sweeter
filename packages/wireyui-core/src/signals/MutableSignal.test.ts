import { expect } from '@jest/globals';

import { calc, mutable } from ".";
import { SignalState } from "./SignalState";

it('MutableSignal listeners invoked with correct value after update', () => {
    const signal = mutable(1);

    let prevStored: SignalState<number> | undefined;
    let nextStored: SignalState<number> | undefined;

    signal.listen(
        (prev, next) => {
            prevStored = prev;
            nextStored = next;
        }
    );

    signal.update(2);

    expect(prevStored).toEqual({ mode: 'SUCCESS', value: 1 } satisfies SignalState<number>);
    expect(nextStored).toEqual({ mode: 'SUCCESS', value: 2 } satisfies SignalState<number>);
});

// This might be very wrong..
it('MutableSignal listeners not attached unless depdendent calculated signal listeners added', () => {
    const mutableSignal = mutable(1);
    const calculatedSignal = calc(() => mutableSignal.value + 1);

    expect(mutableSignal.listenerCount).toEqual(0);

    const remove = calculatedSignal.listen(
        (prev, next) => {
        }
    );

    expect(mutableSignal.listenerCount).toEqual(1);

    remove();

    expect(mutableSignal.listenerCount).toEqual(0);
});