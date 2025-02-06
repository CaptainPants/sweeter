import { typeAssert } from '@serpentis/ptolemy-utilities';

import { $mutable } from './$mutable.js';
import {
    type ReadWriteSignal,
    type Signal,
    type Unsignal,
    type UnsignalAll,
    type WritableSignal,
} from './types.js';

test('Signal expansion works right', () => {
    typeAssert.extends<ReadWriteSignal<number>, Signal<number>>();

    const readWrite = $mutable(0);
    const _read: Signal<number> = readWrite;

    typeAssert.doesNotExtend<WritableSignal<number>, Signal<number>>();

    typeAssert.extends<ReadWriteSignal<number>, WritableSignal<number>>();
});

test('Unsignal', () => {
    typeAssert.equal<Unsignal<number>, number>();
    typeAssert.equal<Unsignal<Signal<number>>, number>();
    typeAssert.equal<Unsignal<ReadWriteSignal<number>>, number>();
    typeAssert.equal<
        Unsignal<Signal<number> | undefined>,
        number | undefined
    >();
    typeAssert.equal<
        Unsignal<Signal<number> | Signal<boolean> | undefined>,
        number | boolean | undefined
    >();
});

interface Example1 {
    signal: Signal<number>;
    maybeSignal: Signal<number> | number;
    optionalSignal?: Signal<number>;
}
interface UnsignalledExample1 {
    signal: number;
    maybeSignal: number;
    optionalSignal?: number;
}

test('UnsignalAll', () => {
    typeAssert.equal<UnsignalAll<Example1>, UnsignalledExample1>();
});
