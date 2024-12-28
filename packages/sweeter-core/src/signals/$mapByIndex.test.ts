import { $derived } from './$derived';
import { $mapByIndex } from './$mapByIndex';
import { $mutable } from './$mutable';

it('Does stuff', () => {
    const input = $mutable<string[]>(['alpha', 'beta']);

    const mapped = $mapByIndex(input, (input) => {
        return $derived(() => input.value + '_TEST');
    });

    expect(mapped.peek().map((x) => x.peek())).toMatchSnapshot();

    input.value = ['alpha', 'beta', 'gamma'];

    expect(mapped.peek().map((x) => x.peek())).toMatchSnapshot();
});
