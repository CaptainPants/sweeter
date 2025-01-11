import { $mutable } from './$mutable.js';
import {
    callAndReturnDependencies,
    trackingIsAnError,
    untrack,
} from './ambient.js';

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

it('trackingIsAnError throws', () => {
    const signal = $mutable(1);

    expect(() => {
        trackingIsAnError(() => {
            void signal.value;
        });
    }).toThrowError();
});

it('untrack blocks dependency tracking', () => {
    const signal = $mutable(1);

    trackingIsAnError(() => {
        untrack(() => {
            void signal.value;
        });
    });

    const res = callAndReturnDependencies(() => {
        untrack(() => {
            void signal.value;
        });
    }, false);

    expect(res.dependencies).to.have.lengthOf(0);
});
