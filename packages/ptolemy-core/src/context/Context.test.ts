import { $insertLocation } from '../utility/$insertLocation.js';

import { Context } from './Context.js';

const context = new Context<number>('Test', 1);

it('specifying context works', () => {
    expect(context.getCurrent()).toStrictEqual(1);

    context.invokeWith(2, $insertLocation(), () => {
        expect(context.getCurrent()).toStrictEqual(2);

        context.invokeWith(3, $insertLocation(), () => {
            expect(context.getCurrent()).toStrictEqual(3);
        });
    });

    const revert = context.replace(4, $insertLocation());

    expect(context.getCurrent()).toStrictEqual(4);

    context.invokeWith(5, $insertLocation(), () => {
        expect(context.getCurrent()).toStrictEqual(5);
    });

    expect(context.getCurrent()).toStrictEqual(4);

    revert();

    expect(context.getCurrent()).toStrictEqual(1);
});
