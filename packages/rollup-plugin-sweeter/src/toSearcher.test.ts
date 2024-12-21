import { toSearcher } from './toSearcher';

it('Search matches', () => {
    expect(toSearcher(['banana'])('This is an example banana.')).toStrictEqual(
        19,
    );
    expect(
        toSearcher(['banana'])('This is an example without the word.'),
    ).toStrictEqual(undefined);

    expect(toSearcher(['alpha', 'beta'])('Some words alpha.')).toStrictEqual(
        11,
    );
    expect(toSearcher(['alpha', 'beta'])('Some words beta.')).toStrictEqual(
        11,
    );
    expect(toSearcher(['alpha', 'beta'])('Some words gamma.')).toStrictEqual(
        undefined,
    );
});
