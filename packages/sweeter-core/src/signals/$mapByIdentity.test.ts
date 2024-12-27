import { $derived } from "./$derived";
import { $mapByIdentity } from "./$mapByIdentity";
import { $mutable } from "./$mutable";

it('Does stuff', () => {
    const input = $mutable<string[]>(['alpha', 'beta']);

    const mapped = $mapByIdentity(
        input,
        (input, index) => {
            return $derived(() => input + '_TEST_' + index.value);
        },
        (item, source) => source
    );

    expect(mapped.peek().map(x => x.peek())).toMatchSnapshot();

    input.value = ['beta', 'gamma'];

    expect(mapped.peek().map(x => x.peek())).toMatchSnapshot();
});