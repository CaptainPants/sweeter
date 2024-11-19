import { type } from 'arktype';
import { Rules } from '../Rules.js';

import { matchDefinitionRulePart } from './matchDefinitionRule.js';
import { extendArkTypes } from '../../index.js';

test('label', async () => {
    extendArkTypes();

    const x = type.number;
    const y = type.string;

    expect(
        matchDefinitionRulePart(
            { settings: {} },
            {
                type: type.number.annotations().label('test-label').end(),
                parentInfo: null,
            },
            Rules.label('test-label'),
        ),
    ).toStrictEqual(true);
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            {
                type: type.number.annotations().label('test-label').end(),
                parentInfo: null,
            },
            Rules.label('test-label'),
        ),
    ).toStrictEqual(true);

    expect(
        matchDefinitionRulePart(
            { settings: {} },
            {
                type: type.number.annotations().label('label1').end(),
                parentInfo: null,
            },
            Rules.label('label1-suffix'),
        ),
    ).toStrictEqual(false);
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            { type: type.number, parentInfo: null },
            Rules.label('test-label'),
        ),
    );
});

test('attribute', async () => {
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            {
                type: type.number
                    .annotations()
                    .attr('type', 'ham-sandwich')
                    .end(),
                parentInfo: null,
            },
            Rules.attr('type', 'ham-sandwich'),
        ),
    ).toStrictEqual(true);
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            { type: type.number, parentInfo: null },
            Rules.attr('type', 'ham-sandwich'),
        ),
    ).toStrictEqual(false);
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            {
                type: type.number
                    .annotations()
                    .attr('type', 'ham-sandwich')
                    .attr('other', 'thing')
                    .end(),
                parentInfo: null,
            },
            Rules.attr('type', 'ham-sandwich'),
        ),
    ).toStrictEqual(true);
});
