import { type } from 'arktype';
import { ModelFactory } from '../models/ModelFactory.js';
import { type TypeInfo } from '../models/parents.js';

import { createTypeMatcher } from './createTypeMatcher.js';
import { matchDefinitionRule } from './internal/matchDefinitionRule.js';
import { Matcher } from './Matcher.js';
import { Rules } from './Rules.js';
import { type TypeMatcherRule } from './types.js';
import { extendArkTypes } from '../index.js';

beforeAll(() => {
    extendArkTypes();
});

test('test', async () => {

    const rules: Array<TypeMatcherRule<number>> = [
        {
            name: 'rule1',
            matches: Rules.label('1'),
            priority: 0,
            result: 1,
        },
        {
            name: 'rule2',
            matches: Rules.label('2'),
            priority: 0,
            result: 2,
        },
    ];

    const matcher = new Matcher<TypeMatcherRule<number>, TypeInfo>(
        rules,
        matchDefinitionRule,
    );

    const numType1 = type.number.annotate((add) => add.label('2'));
    const numType2 = type.number.annotate((add) => add.label('1'));
    const numType3 = type.number.annotate((add) => add.label('3'));

    const match1 = matcher.findBestMatch(
        { settings: {} },
        { type: numType1, parentInfo: null },
    );
    const match2 = matcher.findBestMatch(
        { settings: {} },
        { type: numType2, parentInfo: null },
    );
    const match3 = matcher.findBestMatch(
        { settings: {} },
        { type: numType3, parentInfo: null },
    );

    expect(match1?.name).toStrictEqual('rule2');
    expect(match1?.result).toStrictEqual(2);

    expect(match2?.name).toStrictEqual('rule1');
    expect(match2?.result).toStrictEqual(1);

    expect(match3).toStrictEqual(null);
});

test('ordered', async () => {
    const rules: Array<TypeMatcherRule<number>> = [
        {
            name: 'rule1',
            matches: Rules.label('1'),
            priority: 0,
            result: 1,
        },
        {
            name: 'rule2',
            matches: Rules.label('1'),
            priority: 0,
            result: 2,
        },
    ];

    const matcher = createTypeMatcher(rules);

    const numModel1 = await ModelFactory.createModel({
        value: 2,
        schema: type.number.annotate((add) => add.label('1')),
        parentInfo: null,
    });

    const match1 = matcher.findBestMatch(
        { settings: {} },
        {
            type: numModel1.type,
            parentInfo: numModel1.parentInfo,
        },
    );

    expect(match1?.name).toStrictEqual('rule2');
    expect(match1?.result).toStrictEqual(2);
});

function createRule(
    id: string,
    label: string,
    priority: number,
): TypeMatcherRule<string> {
    return {
        name: `rule-${id}`,
        matches: Rules.label(label),
        priority,
        result: id,
    };
}

test('multiple-ordered', async () => {
    const rules = [
        createRule('1', '1', 1),
        createRule('2', '1', 2),
        createRule('3', '1', 1),
        createRule('4', '1', 2),
        createRule('5', '2', 1),
        createRule('6', '2', 2),
        createRule('7', '2', 1),
        createRule('8', '2', 2),
    ];

    const matcher = createTypeMatcher(rules);

    const model = await ModelFactory.createModel({
        schema: type.number.annotate((add) => add.label('2')),
        value: 6,
        parentInfo: null,
    });

    const results = matcher.findAllMatches(
        { settings: {} },
        {
            type: model.type,
            parentInfo: model.parentInfo,
        },
    );

    const expected = [
        createRule('8', '2', 2),
        createRule('6', '2', 2),
        createRule('7', '2', 1),
        createRule('5', '2', 1),
    ];

    expect(results).toStrictEqual(expected);
});
