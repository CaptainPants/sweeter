import { calc, derived, mutable, mutableCalc } from './index.js';
import { isMutableSignal, isSignal } from './isSignal.js';

it('isSignal for all signal types return true', () => {
    const a = mutable(0);
    const b = calc(() => 1);

    const c = mutable({ prop: 1 });
    const d = mutableCalc(
        () => 1,
        () => {},
    );
    const e = derived(c, 'prop');

    expect(isSignal(a)).toBe(true);
    expect(isSignal(b)).toBe(true);
    expect(isSignal(c)).toBe(true);
    expect(isSignal(d)).toBe(true);
    expect(isSignal(e)).toBe(true);
});

it('isMutableSignal for mutable signal types return true', () => {
    const a = mutable(0);

    const c = mutable({ prop: 1 });
    const d = mutableCalc(
        () => 1,
        () => {},
    );
    const e = derived(c, 'prop');

    expect(isMutableSignal(a)).toBe(true);
    expect(isMutableSignal(c)).toBe(true);
    expect(isMutableSignal(d)).toBe(true);
    expect(isMutableSignal(e)).toBe(true);
});

it('isMutableSignal for CalculatedSignal returns false', () => {
    const a = calc(() => 1);

    expect(isMutableSignal(a)).toBe(false);
});
