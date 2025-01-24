import { Type, type } from 'arktype';

import '../extendArkTypes.js';

const cases: [string, Type<unknown>][] = [
    type.string,
    type.number,
    type.boolean,
    type.undefined,
    type.null,
    type.bigint,
    type({ test: '1' }),
    type.string.array(),
    type.string.or(type.number),
    type({ test: '1' }).and({ other: 'number' }),
    type([type.string, type.string]),
].map((x) => [x.expression, x] as const);

it.each(cases)('basic types are extended correctly %s', (_expr, current) => {
    const annotated = current.annotate((x) =>
        x.displayName('NAME_' + current.expression),
    );
    const read = annotated.annotations()?.displayName();

    expect(
        read,
        `Type ${current.expression} failed displayName check`,
    ).toStrictEqual('NAME_' + current.expression);
});
