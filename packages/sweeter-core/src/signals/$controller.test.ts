import { $controller } from './$controller.js';
import { SignalState } from './SignalState.js';

it('Controlled does stuff', () => {
    const controller = $controller<number>();

    const signal = controller.signal;

    expect(signal.inited).toStrictEqual(false);

    controller.updateState(SignalState.success(1234));

    expect(signal.value).toStrictEqual(1234);

    controller.updateState(SignalState.error(new Error('This is an error')));

    expect(() => {
        const _ = signal.value;
    }).toThrow('This is an error');
});
