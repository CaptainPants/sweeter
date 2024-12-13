import { $mutable } from './$mutable.js';
import { callAndReturnDependencies } from './ambient.js';

it('DerivedSignal listeners invoked with correct value after update', () => {
    const mutableSignal1 = $mutable(1);
    const mutableSignal2 = $mutable(2);

    const res = callAndReturnDependencies(
        () => mutableSignal1.value + mutableSignal2.value,
        true,
    );

    if (!res.succeeded) {
        expect.fail();
    }

    const { result, dependencies } = res;

    expect(result).toEqual(3);
    expect(dependencies).toEqual(new Set([mutableSignal1, mutableSignal2]));
});
