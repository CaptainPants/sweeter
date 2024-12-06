import { $calc, $controller, SignalState, flattenElements } from '../index.js';

it('throws through layers', () => {
    const controller = $controller<boolean>(SignalState.success(false));

    const throws = $calc(() => {
        if (controller.signal.value) {
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

    controller.updateState(SignalState.error(new Error('TEST')));

    expect(handlerRan).toStrictEqual(true);
    expect(threw).toStrictEqual(true);
});
