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
            {() => {
                return <OnMountThrows />;
            }}
        </ErrorBoundary>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});

const TrackSignalsThrows: Component = (_, init) => {
    init.trackSignals([1], ([_]) => {
        throw new Error('Error thrown on trackSignals');
    });

    return <></>;
};

it('trackSignals', () => {
    const res = testRender(() => (
        <ErrorBoundary
            renderError={(err) => <div class="error">{String(err)}</div>}
        >
            {() => <TrackSignalsThrows />}
        </ErrorBoundary>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
