import { $mutable } from './$mutable.js';
import { $derived } from './$derived.js';
import { SignalState } from './SignalState.js';

it('$derived listeners invoked with correct value after dependency updated', () => {
    const mutableSignal = $mutable(1);
    const derivedSignal = $derived(() => mutableSignal.value + 1);

    let prevStored: SignalState<number> | undefined;
    let nextStored: SignalState<number> | undefined;

    derivedSignal.listen((next, prev) => {
        prevStored = prev;
        nextStored = next;
    });

    mutableSignal.value = 2;

    expect(prevStored).toEqual(SignalState.success(2));
    expect(nextStored).toEqual(SignalState.success(3));

    expect(derivedSignal.value).toEqual(3);
});

it('$derived can be released', () => {
    const releaseController = new AbortController();

    const mutableSignal = $mutable(1);
    const derivedSignal = $derived(() => mutableSignal.value + 1, {
        release: releaseController.signal,
    });

    // Update works while not aborted
    mutableSignal.value = 2;

    expect(derivedSignal.value).toEqual(3);

    releaseController.abort();

    mutableSignal.value = 3;

    expect(derivedSignal.value).toEqual(3);
});
