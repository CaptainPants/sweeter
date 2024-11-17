
import { type } from 'arktype';
import { type TypeInfo } from '../models/parents.js';

import { matchDefinitionRule } from './internal/matchDefinitionRule.js';
import { Matcher } from './Matcher.js';
import { Rules } from './Rules.js';
import { type TypeMatcherRule } from './types.js';

test('test', async () => {
    const rules: Array<TypeMatcherRule<number>> = [
        {
            name: 'rule1',
            matches: Rules.number(),
            priority: 0,
            result: 1,
        },
        {
            name: 'rule2',
            matches: Rules.string(),
            priority: 0,
            result: 2,
        },
    ];

    const matcher = new Matcher<TypeMatcherRule<number>, TypeInfo>(
        rules,
        matchDefinitionRule,
    );

    const stringType = type.string;
    const numberType = type.number;

    const stringMatch = matcher.findBestMatch(
        { settings: {} },
        {
            type: stringType,
            parentInfo: null,
        },
    );
    const numberMatch = matcher.findBestMatch(
        { settings: {} },
        {
            type: numberType,
            parentInfo: null,
        },
    );

    expect(stringMatch?.name).toStrictEqual('rule2');
    expect(stringMatch?.result).toStrictEqual(2);

    expect(numberMatch?.name).toStrictEqual('rule1');
    expect(numberMatch?.result).toStrictEqual(1);
});
