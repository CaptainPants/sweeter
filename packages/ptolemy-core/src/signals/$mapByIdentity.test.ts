import { $derived } from './$derived.js';
import { $mapByIdentity } from './$mapByIdentity.js';
import { $mutable } from './$mutable.js';
import { Signal } from './types.js';

it('Does stuff', () => {
    const input = $mutable<string[]>(['alpha', 'beta']);

    const mapped = $mapByIdentity(input, (input, index) => {
        return $derived(() => input + '_TEST_' + index.value);
    });

    expect(mapped.peek().map((x) => x.peek())).toMatchSnapshot();

    input.value = ['beta', 'gamma'];

    expect(mapped.peek().map((x) => x.peek())).toMatchSnapshot();
});

it('Changing mapping function rebuilds', () => {
    const input = $mutable<string[]>(['alpha', 'beta']);

    const mappingFun = $mutable((input: string, index: Signal<number>) => {
        return $derived(() => input + '_TEST1_' + index.value);
    });

    const mapped = $mapByIdentity(input, mappingFun);

    let counter = 0;
    mapped.listen(() => {
        counter++;
    });

    expect(mapped.peek().map((x) => x.peek())).toMatchSnapshot();

    mappingFun.value = (input, index) => {
        return $derived(() => input + '_TEST2_' + index.value);
    };

    expect(counter).toStrictEqual(1);

    expect(mapped.peek().map((x) => x.peek())).toMatchSnapshot();
});
