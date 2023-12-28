import { assertNotNullOrUndefined } from '@captainpants/sweeter-utilities';

export async function mapAsync<T, U>(
    list: readonly T[],
    callback: (item: T, index: number) => Promise<U> | U,
): Promise<U[]> {
    const res: U[] = [];
    for (let i = 0; i < list.length; ++i) {
        const item = list[i];
        assertNotNullOrUndefined(item);
        res.push(await callback(item, i));
    }
    return res;
}
