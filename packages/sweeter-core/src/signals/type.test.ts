import { typeAssert } from '@captainpants/sweeter-utilities';

import { $mutable } from './$mutable.js';
import { ReadWriteSignal, Signal, WritableSignal } from './types.js';

test('Signal expansion works right', () => {
    typeAssert.extends<ReadWriteSignal<number>, Signal<number>>();

    const readWrite = $mutable(0);
    const _read: Signal<number> = readWrite;

    typeAssert.doesNotExtend<WritableSignal<number>, Signal<number>>();

    typeAssert.extends<ReadWriteSignal<number>, WritableSignal<number>>();
});
