import { $derived } from './$derived';
import { $mutable } from './$mutable';
import { Signal } from './types';

interface Bits {
    dependency?: Signal<number>;
    dependencyWeakRef: WeakRef<Signal<number>>;
    derived?: Signal<number>;
    derivedWeakRef: WeakRef<Signal<number>>;
    solo?: Signal<string>;
    soloWeakRef: WeakRef<Signal<string>>;
}

function setup(): Bits {
    const dependency = $mutable(12);

    const dependencyWeakRef = new WeakRef(dependency);

    // This is a strong reference
    const derived = $derived(() => dependency.value + 1);

    const derivedWeakRef = new WeakRef(derived);

    const solo = $mutable('test');

    const soloWeakRef = new WeakRef(solo);

    return {
        dependency,
        dependencyWeakRef,
        derived,
        derivedWeakRef,
        solo,
        soloWeakRef,
    };
}

it('Derived signals keep alive their dependencies', async () => {
    const bits = setup();

    expect(bits.dependency?.getDebugListenerInfo()?.liveCount).toStrictEqual(0);

    bits.derived?.peek(); // This triggers registration of the listener on bits.dependency

    expect(bits.dependency?.getDebugListenerInfo()?.liveCount).toStrictEqual(1);

    delete bits.dependency; // Remove the only direct reference
    delete bits.solo;

    await global.gc!({ execution: 'async', type: 'major' });

    // The signal that isn't referenced from derived should be GC-d 
    expect(bits.soloWeakRef.deref()).toStrictEqual(undefined);
    // The signal that is referenced should not
    expect(bits.dependencyWeakRef.deref()).not.toStrictEqual(undefined);

    delete bits.derived; // Remove all references to derived, which should free them both up to be garbage collected

    await global.gc!({ execution: 'async', type: 'major' });

    // Neither is reachable now, so should have been GC-d
    expect(bits.derivedWeakRef.deref()).toStrictEqual(undefined);
    expect(bits.dependencyWeakRef.deref()).toStrictEqual(undefined);
});
