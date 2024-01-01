import {
    $calc,
    $mutableFromCallbacks,
    $mutable,
    $propertyOf,
    $elementOf,
} from './index.js';
import { isReadWriteSignal, isSignal } from './isSignal.js';

it('isSignal for all signal types return true', () => {
    const a = $mutable(0);
    const b = $calc(() => 1);

    const c = $mutable({ prop: 1 });
    const d = $mutableFromCallbacks(
        () => 1,
        () => {},
    );
    const e = $propertyOf(c, 'prop');
    const f = $mutable([{ prop: 1 }]);
    const g = $elementOf(f, 0);

    expect(isSignal(a)).toBe(true);
    expect(isSignal(b)).toBe(true);
    expect(isSignal(c)).toBe(true);
    expect(isSignal(d)).toBe(true);
    expect(isSignal(e)).toBe(true);
    expect(isSignal(f)).toBe(true);
    expect(isSignal(e)).toBe(true);
    expect(isSignal(g)).toBe(true);
});

it('isReadWriteSignal for mutable signal types return true', () => {
    const a = $mutable(0);

    const c = $mutable({ prop: 1 });
    const d = $mutableFromCallbacks(
        () => 1,
        () => {},
    );
    const e = $propertyOf(c, 'prop');
    const f = $mutable([{ prop: 1 }]);
    const g = $elementOf(f, 0);

    expect(isReadWriteSignal(a)).toBe(true);
    expect(isReadWriteSignal(c)).toBe(true);
    expect(isReadWriteSignal(d)).toBe(true);
    expect(isReadWriteSignal(e)).toBe(true);
    expect(isReadWriteSignal(f)).toBe(true);
    expect(isReadWriteSignal(g)).toBe(true);
});

it('isReadWriteSignal for CalculatedSignal returns false', () => {
    const a = $calc(() => 1);

    expect(isReadWriteSignal(a)).toBe(false);
});
