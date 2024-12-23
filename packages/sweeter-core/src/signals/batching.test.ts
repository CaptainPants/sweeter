import { batch, $derived, $mutable, startBatch } from './index.js';

it('Starting a batch blocks updates', () => {
    const mutable1 = $mutable(1);
    const mutable2 = $mutable(2);
    const calculated = $derived(() => mutable1.value + mutable2.value);

    let called = false;
    const unlisten = calculated.listen(() => {
        called = true;
    });

    const finish = startBatch();

    mutable1.value += 1;
    mutable2.value += 1;

    expect(called).toBe(false);

    finish();

    expect(called).toBe(true);
    expect(calculated.value).toBe(5);

    unlisten();
});

it('Starting a batch blocks updates (callback)', () => {
    const mutable1 = $mutable(1);
    const mutable2 = $mutable(2);
    const calculated = $derived(() => mutable1.value + mutable2.value);

    let called = false;
    const unlisten = calculated.listen(() => {
        called = true;
    });

    batch(() => {
        mutable1.value += 1;
        mutable2.value += 1;

        expect(called).toBe(false);
    });

    expect(called).toBe(true);
    expect(calculated.value).toBe(5);

    unlisten();
});

it('When required a calculation can be updated during a batch', () => {
    const mutable1 = $mutable(1);
    const mutable2 = $mutable(2);
    const calculated = $derived(() => mutable1.value + mutable2.value);

    let called = false;
    const unlisten = calculated.listen(() => {
        called = true;
    });

    batch(() => {
        mutable1.value += 1;
        mutable2.value += 1;

        expect(called).toBe(false);

        const _ = calculated.value; // This should trigger it to be recalculated (which triggers listeners)

        expect(called).toBe(true);
    });

    unlisten();
});
