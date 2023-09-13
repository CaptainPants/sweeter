import { expect } from '@jest/globals';

import { mutable } from './MutableValueSignal.js';
import { callAndReturnDependencies } from './ambient.js';

it('CalculatedSignal listeners invoked with correct value after update', () => {
    const mutableSignal1 = mutable(1);
    const mutableSignal2 = mutable(2);

    const { result, dependencies } = callAndReturnDependencies(
        () => mutableSignal1.value + mutableSignal2.value,
        true,
    );

    expect(result).toEqual(3);
    expect(dependencies).toEqual(new Set([mutableSignal1, mutableSignal2]));
});
