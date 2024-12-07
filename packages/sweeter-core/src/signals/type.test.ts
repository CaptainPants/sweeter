import { typeAssert } from '@captainpants/sweeter-utilities';
import { ReadWriteSignal, Signal, WritableSignal } from './types';
import { $mutable } from './$mutable';

test('Signal expansion works right', () => {
    typeAssert.extends<ReadWriteSignal<number>, Signal<number>>();

    const readWrite = $mutable(0);
    const _read: Signal<number> = readWrite;

    typeAssert.doesNotExtend<WritableSignal<number>, Signal<number>>();

    typeAssert.extends<ReadWriteSignal<number>, WritableSignal<number>>();
});
