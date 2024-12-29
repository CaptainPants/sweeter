import { $derived } from './$derived';
import { $mapByIndex } from './$mapByIndex';
import { $mutable } from './$mutable';
import { Signal } from './types';

it('Does stuff', () => {
    const input = $mutable<string[]>(['alpha', 'beta']);

    const mapped = $mapByIndex(input, (input) => {
        return $derived(() => input.value + '_TEST');
    });

    let counter = 0;
    mapped.listen(() => {
        counter++;
    });

    expect(mapped.peek().map((x) => x.peek())).toMatchSnapshot();

    input.value = ['alpha', 'beta', 'gamma'];

    expect(counter).toStrictEqual(1);

    expect(mapped.peek().map((x) => x.peek())).toMatchSnapshot();
});

it('Changing mapping function rebuilds', () => {
    const input = $mutable<string[]>(['alpha', 'beta']);

    const mappingFun = $mutable((input: Signal<string>) => {
        return $derived(() => input.value + '_TEST1');
    });

    const mapped = $mapByIndex(input, mappingFun);

    let counter = 0;
    mapped.listen(() => {
        counter++;
    });

    expect(mapped.peek().map((x) => x.peek())).toMatchSnapshot();

    mappingFun.value = (input) => {
        return $derived(() => input.value + '_TEST2');
    };

    expect(counter).toStrictEqual(1);

    expect(mapped.peek().map((x) => x.peek())).toMatchSnapshot();
});
