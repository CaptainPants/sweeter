import { equals } from '@captainpants/sweeter-utilities';

import { $filtered } from './$filtered.js';
import { $mutable } from './$mutable.js';

it('Updates are skipped as expected', () => {
    const input = $mutable([1, 2, 3]);

    const filtered = $filtered(input, equals.arrayElements);

    let counter = 0;

    filtered.listen(() => {
        ++counter;
    });

    input.value = [1, 2, 3];

    expect(counter).toStrictEqual(0);
    expect(filtered.peek()).toStrictEqual([1, 2, 3]);

    input.value = [1, 2, 3, 4];

    expect(counter).toStrictEqual(1);
    expect(filtered.peek()).toStrictEqual([1, 2, 3, 4]);
});
