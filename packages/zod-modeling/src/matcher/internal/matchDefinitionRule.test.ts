import { z } from 'zod';
import { Rules } from '../Rules.js';

import { matchDefinitionRulePart } from './matchDefinitionRule.js';

test('label', async () => {
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            { type: z.number().meta().label('test-label').endMeta(), parentInfo: null },
            Rules.label('test-label'),
        ),
    ).toStrictEqual(true);
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            { type: z.number().meta().label('test-label').endMeta(), parentInfo: null },
            Rules.label('test-label'),
        ),
    ).toStrictEqual(true);

    expect(
        matchDefinitionRulePart(
            { settings: {} },
            { type: z.number().meta().label('label1').endMeta(), parentInfo: null },
            Rules.label('label1-suffix'),
        ),
    ).toStrictEqual(false);
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            { type: z.number(), parentInfo: null },
            Rules.label('test-label'),
        ),
    );
});

test('attribute', async () => {
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            {
                type: z.number().meta().attr('type', 'ham-sandwich').endMeta(),
                parentInfo: null,
            },
            Rules.attr('type', 'ham-sandwich'),
        ),
    ).toStrictEqual(true);
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            { type: z.number(), parentInfo: null },
            Rules.attr('type', 'ham-sandwich'),
        ),
    ).toStrictEqual(false);
    expect(
        matchDefinitionRulePart(
            { settings: {} },
            {
                type: z
                    .number()
                    .meta()
                    .attr('type', 'ham-sandwich')
                    .attr('other', 'thing')
                    .endMeta(),
                parentInfo: null,
            },
            Rules.attr('type', 'ham-sandwich'),
        ),
    ).toStrictEqual(true);
});
