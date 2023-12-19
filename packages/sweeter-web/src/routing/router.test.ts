import { matchers } from "./matchers/index.js";
import { matches } from "./matches.js";
import { route } from "./route.js";

it('static', () => {
    const template = route`route/to/whatever`;
    const input = 'route/to/whatever';

    const match = matches(input, template)

    expect(match).toStrictEqual(true);
})

it('with a matcher', () => {
    const params = {
        a: matchers.string
    };
    const template = route`route/${params.a}/whatever`;
    const input = 'route/to/whatever';

    const match = matches(input, template)

    expect(match).toStrictEqual(true);
})