import {
    $derive,
    $controller,
    SignalState,
    flattenElements,
} from '../index.js';

it('throws through layers', () => {
    const controller = $controller<boolean>(SignalState.success(false));

    const throws = $derive(() => {
        if (controller.signal.value) {
            throw new Error('ERROR');
        }

        return 'TEST';
    });

    const calculated1 = $derive(() => {
        return throws;
    });
    const calculated2 = $derive(() => {
        return calculated1;
    });

    const flattened = flattenElements(calculated2);

    let handlerRan = false;
    let threw = false;

    flattened.listen((newState) => {
        handlerRan = true;
        threw = newState.mode === 'ERROR';
    });

    controller.updateState(SignalState.error(new Error('TEST')));

    expect(handlerRan).toStrictEqual(true);
    expect(threw).toStrictEqual(true);
});
