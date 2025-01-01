import { $derived } from "./$derived";
import { $mutable } from "./$mutable"
import { Signal } from "./types"

function setup(): { dependency?: Signal<number>, dependencyWeakRef: WeakRef<Signal<number>>, derived?: Signal<number>, derivedWeakRef: WeakRef<Signal<number>> } {
    let dependency: Signal<number> = $mutable(12);

    const dependencyWeakRef = new WeakRef(dependency);

    // This is a strong reference
    let derived: Signal<number> = $derived(() => (dependency?.value ?? 0) + 1);

    const derivedWeakRef = new WeakRef(derived);

    return { dependency, dependencyWeakRef, derived, derivedWeakRef };
}

it('Derived signals keep alive their dependencies', async () => {
    const bits = setup();

    delete bits.dependency; // remove the direct reference

    await global.gc?.({ execution: 'async', type: 'major' });

    expect(bits.dependencyWeakRef.deref()).not.toStrictEqual(undefined);

    delete bits.derived; // remove all references to derived, which should free them both up to be garbage collected

    await global.gc?.({ execution: 'async', type: 'major' });

    expect(bits.derivedWeakRef.deref()).toStrictEqual(undefined);
    expect(bits.dependencyWeakRef.deref()).toStrictEqual(undefined);
});