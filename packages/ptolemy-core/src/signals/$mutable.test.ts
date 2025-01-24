import { $mutable } from './$mutable.js';
import { SignalState } from './SignalState.js';

it('MutableValueSignal has initial value', () => {
    const signal = $mutable(23);

    const value = signal.value;

    expect(value).toStrictEqual(23);
});

it('MutableValueSignal listeners invoked with correct value after update', () => {
    const signal = $mutable(1);

    let prevStored: SignalState<number> | undefined;
    let nextStored: SignalState<number> | undefined;

    signal.listen((next, prev) => {
        prevStored = prev;
        nextStored = next;
    });

    signal.value = 2;

    expect(prevStored).toEqual(SignalState.success(1));
    expect(nextStored).toEqual(SignalState.success(2));
});
