import { match } from './match/index.js';
import { route } from './route.js';
import { type RouteTemplate } from './types.js';

it('static', () => {
    const template = route`route/to/whatever`;
    const input = 'route/to/whatever';

    const matches = template.match(input);

    expect(matches).toStrictEqual([]);
});

it('with a matcher', () => {
    const template = route`route/${match.segment}/whatever`;
    const input = 'route/abra-kadabra/whatever';

    const matches = template.match(input);

    expect(matches).toStrictEqual(['abra-kadabra']);
});

it('with an end matcher', () => {
    const template = route`route/whatever/${match.remaining}`;
    const input = 'route/whatever/path/to/something';

    const matches = template.match(input);

    expect(matches).toStrictEqual(['path/to/something']);
});

it('with multiple matchers', () => {
    const template = route`route/${match.segment}/banana/${match.segment}/${match.remaining}`;
    const input = 'route/whatever/banana/path/to/something';

    const matches = template.match(input);

    expect(matches).toStrictEqual(['whatever', 'path', 'to/something']);
});

it('case insensitive', () => {
    const template = route`route/${match.segment}/whatever`;
    const input = 'RoUtE/AbRa-KaDaBrA/WhAtEvEr';

    const matches = template.match(input);

    expect(matches).toStrictEqual(['AbRa-KaDaBrA']);
});

it('decay to string array', () => {
    // Note type here is not a tuple but a string array
    const template: RouteTemplate<
        readonly string[]
    > = route`route/${match.segment}/whatever`;
    const input = 'route/abra-kadabra/whatever';

    const matches = template.match(input);

    expect(matches).toStrictEqual(['abra-kadabra']);
});
