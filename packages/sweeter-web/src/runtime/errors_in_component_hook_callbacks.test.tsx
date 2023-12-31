/* @jsxImportSource ../. */

import { type Component } from '@captainpants/sweeter-core';
import { ErrorBoundary } from '@captainpants/sweeter-core';
import { testRender } from '../test/testRender.js';

const OnMountThrows: Component = (_, init) => {
    init.onMount(() => {
        throw new Error('Error thrown on mount');
    });

    return <></>;
};

it('onMount', () => {
    const res = testRender(() => (
        <ErrorBoundary
            renderError={(err) => <div class="error">{String(err)}</div>}
        >
            {() => <OnMountThrows />}
        </ErrorBoundary>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});

const SubscribeToChangesThrows: Component = (_, init) => {
    init.subscribeToChanges([1], ([_]) => {
        throw new Error('Error thrown on subscribeToChanges');
    });

    return <></>;
};

it('subscribeToChanges', () => {
    const res = testRender(() => (
        <ErrorBoundary
            renderError={(err) => <div class="error">{String(err)}</div>}
        >
            {() => <SubscribeToChangesThrows />}
        </ErrorBoundary>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
