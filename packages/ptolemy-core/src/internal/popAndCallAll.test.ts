import { popAndCallAll } from './popAndCallAll.js';

it('popAndCallAll', () => {
    const results: number[] = [];

    const list: (() => void)[] = [
        () => results.push(1),
        () => results.push(2),
        () => results.push(3),
        () => results.push(4),
    ];

    popAndCallAll(list);

    expect(results).toStrictEqual([4, 3, 2, 1]);
});
