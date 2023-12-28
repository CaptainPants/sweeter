import { assertNotNullOrUndefined } from '@captainpants/sweeter-utilities';

export function arrayMoveImmutable<T>(
    array: readonly T[],
    from: number,
    to: number,
): T[] {
    const copy = array.slice();

    if (from < 0 || from >= array.length)
        throw new TypeError(`from ${from} out of range.`);
    if (to < 0 || to >= array.length)
        throw new TypeError(`to ${to} out of range.`);

    if (from === to) {
        return copy;
    }

    const fromItem = array[from];
    assertNotNullOrUndefined(fromItem);

    copy.splice(from, 1);
    copy.splice(to, 0, fromItem);
    return copy;
}
