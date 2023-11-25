import { $mutable } from '@captainpants/sweeter-core';
import { createCssClassSignal } from './createCssClassSignal.js';

it('single static', () => {
    const signal = createCssClassSignal('test');

    expect(signal.value).toStrictEqual(['test']);
});

it('on/off simple', () => {
    const on = $mutable(false);

    const signal = createCssClassSignal(['test', { something: on }]);

    expect(signal.value).toStrictEqual(['test']);

    on.value = true;

    expect(signal.value).toStrictEqual(['test', 'something']);
});

it('switch classname', () => {
    const className = $mutable('alpha');

    const signal = createCssClassSignal(['test', className]);

    expect(signal.value).toStrictEqual(['test', 'alpha']);

    className.value = 'beta';

    expect(signal.value).toStrictEqual(['test', 'beta']);
});
