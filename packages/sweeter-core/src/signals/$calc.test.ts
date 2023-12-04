import { $mutable } from './$mutable.js';
import { $calc } from './$calc.js';
import { type SignalState } from './types.js';

it('CalculatedSignal listeners invoked with correct value after dependency updated', () => {
    const mutableSignal = $mutable(1);
    const calculatedSignal = $calc(() => mutableSignal.value + 1);

    let prevStored: SignalState<number> | undefined;
    let nextStored: SignalState<number> | undefined;

    calculatedSignal.listen((prev, next) => {
        prevStored = prev;
        nextStored = next;
    });

    mutableSignal.value = 2;

    expect(prevStored).toEqual({
        mode: 'SUCCESS',
        value: 2,
    } satisfies SignalState<number>);
    expect(nextStored).toEqual({
        mode: 'SUCCESS',
        value: 3,
    } satisfies SignalState<number>);

    expect(calculatedSignal.value).toEqual(3);
});

it('CalculatedSignal can be released', () => {
    const releaseController = new AbortController();

    const mutableSignal = $mutable(1);
    const calculatedSignal = $calc(() => mutableSignal.value + 1, {
        release: releaseController.signal,
    });

    // Update works while not aborted
    mutableSignal.value = 2;

    expect(calculatedSignal.value).toEqual(3);

    releaseController.abort();

    mutableSignal.value = 3;

    expect(calculatedSignal.value).toEqual(3);
});
