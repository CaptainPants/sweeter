import { type } from 'arktype';

import { Rules } from '../Rules.js';

import { matchDefinitionRulePart } from './matchDefinitionRule.js';
import { extendArkTypes } from '../../extendArkTypes.js';

test('label', async () => {
    extendArkTypes();

    const exampleType = type.number.annotate((add) => add.label('test-label'));

    expect(
        matchDefinitionRulePart(
            { settings: {} },
            {
                type: exampleType,
                parentInfo: null,
            },
            Rules.label('test-label'),
        ),
    ).toStrictEqual(true);

    expect(
        matchDefinitionRulePart(
            { settings: {} },
            {
                type: type.number.annotate((add) => add.label('test-label')),
                parentInfo: null,
            },
            Rules.label('test-label'),
        ),
    ).toStrictEqual(true);

    expect(
        matchDefinitionRulePart(
            { settings: {} },
            {
                type: type.number.annotate((add) => add.label('label1')),
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
                type: type.number.annotate((add) =>
                    add.attr('type', 'ham-sandwich'),
                ),
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
                type: type.number.annotate((add) =>
                    add.attr('type', 'ham-sandwich').attr('other', 'thing'),
                ),
                parentInfo: null,
            },
            Rules.attr('type', 'ham-sandwich'),
        ),
    ).toStrictEqual(true);
});
