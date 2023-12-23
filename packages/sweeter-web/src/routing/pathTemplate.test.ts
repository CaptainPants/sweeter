import { match } from './match/index.js';
import { pathTemplate } from './pathTemplate.js';
import { type PathTemplate } from './types.js';

it('static', () => {
    const template = pathTemplate`route/to/whatever`;
    const input = 'route/to/whatever';

    const matches = template.match(input);

    expect(matches).toStrictEqual([]);
});

it('with a matcher', () => {
    const template = pathTemplate`route/${match.segment}/whatever`;
    const input = 'route/abra-kadabra/whatever';

    const matches = template.match(input);

    expect(matches).toStrictEqual(['abra-kadabra']);
});

it('with an end matcher', () => {
    const template = pathTemplate`route/whatever/${match.remaining}`;
    const input = 'route/whatever/path/to/something';

    const matches = template.match(input);

    expect(matches).toStrictEqual(['path/to/something']);
});

it('with multiple matchers', () => {
    const template = pathTemplate`route/${match.segment}/banana/${match.segment}/${match.remaining}`;
    const input = 'route/whatever/banana/path/to/something';

    const matches = template.match(input);

    expect(matches).toStrictEqual(['whatever', 'path', 'to/something']);
});

it('case insensitive', () => {
    const template = pathTemplate`route/${match.segment}/whatever`;
    const input = 'RoUtE/AbRa-KaDaBrA/WhAtEvEr';

    const matches = template.match(input);

    expect(matches).toStrictEqual(['AbRa-KaDaBrA']);
});

it('decay to string array', () => {
    // Note type here is not a tuple but a string array
    const template: PathTemplate<
        readonly string[]
    > = pathTemplate`route/${match.segment}/whatever`;
    const input = 'route/abra-kadabra/whatever';

    const matches = template.match(input);

    expect(matches).toStrictEqual(['abra-kadabra']);
});
