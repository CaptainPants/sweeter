import { $controlled } from './$controlled.js';
import { SignalController } from './SignalController.js';
import { SignalState } from './SignalState.js';

it('Controlled does stuff', () => {
    const controller = new SignalController<number>();

    const signal = $controlled(controller);

    expect(signal.inited).toStrictEqual(false);

    controller.update(SignalState.success(1234));

    expect(signal.value).toStrictEqual(1234);

    controller.update(SignalState.error(new Error('This is an error')));

    expect(() => {
        const _ = signal.value;
    }).toThrow('This is an error');
});
