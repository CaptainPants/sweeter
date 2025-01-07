
import { $ark } from '@ark/schema';
import '../extendArkTypes.js';
import { Type, type } from 'arktype';

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
    type({ test: '1' }).and({ 'other': 'number' }),
    type([type.string, type.string])
].map(x => [x.expression, x] as const);

it.each(cases)('basic types are extended correctly %s', (expr, current) => {;
    const annotated = current.annotate(x => x.displayName('NAME_' + current.expression));
    const read = annotated.annotations()?.displayName();

    expect(read, `Type ${current.expression} failed displayName check`).toStrictEqual('NAME_' + current.expression);
});