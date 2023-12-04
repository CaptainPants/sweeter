import { $controlled } from './$controlled.js';
import { SignalController } from './SignalController.js';

it('Controlled does stuff', () => {
    const controller = new SignalController<number>();

    const signal = $controlled(controller);

    expect(signal.inited).toStrictEqual(false);

    controller.update({ mode: 'SUCCESS', value: 1234 });

    expect(signal.value).toStrictEqual(1234);

    controller.update({ mode: 'ERROR', error: new Error('This is an error') });

    expect(() => {
        const _ = signal.value;
    }).toThrow('This is an error');
});
