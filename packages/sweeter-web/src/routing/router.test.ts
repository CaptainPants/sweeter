import { match } from './match/index.js';
import { route } from './route.js';

it('static', () => {
    const template = route`route/to/whatever`;
    const input = 'route/to/whatever';

    const matches = template.match(input);

    expect(matches).toStrictEqual([]);
});

it('with a matcher', () => {
    const template = route`route/${match.part}/whatever`;
    const input = 'route/abra-kadabra/whatever';

    const matches = template.match(input);

    expect(matches).toStrictEqual(['abra-kadabra']);
});

it('with an end matcher', () => {
    const template = route`route/whatever/${match.rest}`;
    const input = 'route/whatever/path/to/something';

    const matches = template.match(input);

    expect(matches).toStrictEqual(['path/to/something']);
});

it('case insensitive', () => {
    const template = route`route/${match.part}/whatever`;
    const input = 'RoUtE/AbRa-KaDaBrA/WhAtEvEr';

    const matches = template.match(input);

    expect(matches).toStrictEqual(['AbRa-KaDaBrA']);
});
