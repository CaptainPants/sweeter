import { Types } from '../../types/index.js';
import { Rules } from '../Rules.js';

import { matchDefinitionRulePart } from './matchDefinitionRule.js';

test('label', async () => {
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            { type: Types.number().withLabels('test-label'), parentInfo: null },
            Rules.label('test-label'),
        ),
    ).toStrictEqual(true);
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            { type: Types.number().withLabels('test-label'), parentInfo: null },
            Rules.label('test-label'),
        ),
    ).toStrictEqual(true);

    expect(
        matchDefinitionRulePart(
            { settings: {} },
            { type: Types.number().withLabels('label1'), parentInfo: null },
            Rules.label('label1-suffix'),
        ),
    ).toStrictEqual(false);
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            { type: Types.number(), parentInfo: null },
            Rules.label('test-label'),
        ),
    );
});

test('attribute', async () => {
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            {
                type: Types.number().withAttr('type', 'ham-sandwich'),
                parentInfo: null,
            },
            Rules.attr('type', 'ham-sandwich'),
        ),
    ).toStrictEqual(true);
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            { type: Types.number(), parentInfo: null },
            Rules.attr('type', 'ham-sandwich'),
        ),
    ).toStrictEqual(false);
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            {
                type: Types.number()
                    .withAttr('type', 'ham-sandwich')
                    .withAttr('other', 'thing'),
                parentInfo: null,
            },
            Rules.attr('type', 'ham-sandwich'),
        ),
    ).toStrictEqual(true);
});
