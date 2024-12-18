import { toSearcher } from './toSearcher';

it('Search matches', () => {
    expect(toSearcher(['banana'])('This is an example banana.')).toStrictEqual(
        true,
    );
    expect(
        toSearcher(['banana'])('This is an example without the word.'),
    ).toStrictEqual(false);

    expect(toSearcher(['alpha', 'beta'])('Some words alpha.')).toStrictEqual(
        true,
    );
    expect(toSearcher(['alpha', 'beta'])('Some words beta.')).toStrictEqual(
        true,
    );
    expect(toSearcher(['alpha', 'beta'])('Some words gamma.')).toStrictEqual(
        false,
    );
});
