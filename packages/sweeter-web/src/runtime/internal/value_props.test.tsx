/* @jsxImportSource ../.. */

import { $mutable, assertNeverNullish } from '@captainpants/sweeter-core';
import { testRender } from '../../test/testRender.js';
import { type ThreeValueBoolean, indeterminite } from '../../indeterminate.js';

it('changing value updates original signal', () => {
    let storedRef: HTMLInputElement | undefined;
    const state = $mutable<string>('original-0');

    const res = testRender(() => (
        <input type="text" ref={(ref) => (storedRef = ref)} value={state} />
    ));

    assertNeverNullish(storedRef);

    // Make sure the initial value made it through
    expect(storedRef.value).toStrictEqual('original-0');

    storedRef.value = 'updated-1';

    const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
    });

    storedRef.dispatchEvent(inputEvent);

    expect(state.value).toStrictEqual('updated-1');

    res.dispose();
});

it('changing checked updates original signal', () => {
    let storedRef: HTMLInputElement | undefined;
    const state = $mutable<ThreeValueBoolean>(false);

    const res = testRender(() => (
        <input type="text" ref={(ref) => (storedRef = ref)} checked={state} />
    ));

    assertNeverNullish(storedRef);

    // Make sure the initial value made it through
    expect(storedRef.checked).toStrictEqual(false);

    storedRef.checked = true;

    const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
    });

    storedRef.dispatchEvent(inputEvent);

    expect(state.value).toStrictEqual(true);

    res.dispose();
});

it('changing checked to indeterminite updates original signal', () => {
    let storedRef: HTMLInputElement | undefined;
    const state = $mutable<ThreeValueBoolean>(indeterminite);

    const res = testRender(() => (
        <input type="text" ref={(ref) => (storedRef = ref)} checked={state} />
    ));

    assertNeverNullish(storedRef);

    // Make sure the initial value made it through
    expect(storedRef.indeterminate).toStrictEqual(true);

    storedRef.indeterminate = false;
    storedRef.checked = true;

    const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
    });

    storedRef.dispatchEvent(inputEvent);

    expect(state.value).toStrictEqual(true);

    res.dispose();
});
