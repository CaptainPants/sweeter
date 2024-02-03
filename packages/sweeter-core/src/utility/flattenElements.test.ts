import {
    $calc,
    $controlled,
    SignalController,
    flattenElements,
} from '../index.js';

it('throws through layers', () => {
    const controller = new SignalController<boolean>();
    const trigger = $controlled(controller, { mode: 'SUCCESS', value: false });

    const throws = $calc(() => {
        if (trigger.value) {
            throw new Error('ERROR');
        }

        return 'TEST';
    });

    const calculated1 = $calc(() => {
        return throws;
    });
    const calculated2 = $calc(() => {
        return calculated1;
    });

    const flattened = flattenElements(calculated2);

    let handlerRan = false;
    let threw = false;

    flattened.listen(() => {
        handlerRan = true;
        threw = flattened.peekState().mode === 'ERROR';
    });

    controller.update({ mode: 'ERROR', error: new Error('TEST') });

    expect(handlerRan).toStrictEqual(true);
    expect(threw).toStrictEqual(true);
});
