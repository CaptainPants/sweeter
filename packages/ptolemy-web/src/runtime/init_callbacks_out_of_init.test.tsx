/* @jsxImportSource ../. */

import { type Component, type ComponentInit } from '@serpentis/ptolemy-core';
import { ErrorBoundary } from '@serpentis/ptolemy-core';

import { testRender } from '../test/testRender.js';

interface CallerProps {
    callback: (init: ComponentInit) => void;
    handleError: (err: unknown) => void;
}

const Caller: Component<CallerProps> = ({ callback, handleError }, init) => {
    queueMicrotask(() => {
        try {
            callback.peek()(init);
        } catch (ex) {
            handleError.peek()(ex);
        }
    });

    return <></>;
};

function defer<T>() {
    const abort = new AbortController();
    const promise = new Promise((resolve) => {
        abort.signal.addEventListener('abort', () => {
            resolve(abort.signal.reason);
        });
    });

    return {
        resolve: (value: T) => {
            abort.abort(value);
        },
        promise,
    };
}

it('onMount', async () => {
    const deferred = defer<unknown>();

    const res = testRender(() => (
        <ErrorBoundary
            renderError={(err) => <div class="error">{String(err)}</div>}
        >
            {() => (
                <Caller
                    callback={(init) => init.onMount(() => {})}
                    handleError={deferred.resolve}
                />
            )}
        </ErrorBoundary>
    ));

    const err = await deferred.promise;

    expect(err).toHaveProperty(
        'message',
        'onMount must only be called during init phase.',
    );

    res.dispose();
});

it('onUnMount', async () => {
    const deferred = defer<unknown>();

    const res = testRender(() => (
        <ErrorBoundary
            renderError={(err) => <div class="error">{String(err)}</div>}
        >
            {() => (
                <Caller
                    callback={(init) => init.onUnMount(() => {})}
                    handleError={deferred.resolve}
                />
            )}
        </ErrorBoundary>
    ));

    const err = await deferred.promise;

    expect(err).toHaveProperty(
        'message',
        'onUnMount must only be called during init phase.',
    );

    res.dispose();
});

it('subscribeToChanges', async () => {
    const deferred = defer<unknown>();

    const res = testRender(() => (
        <ErrorBoundary
            renderError={(err) => <div class="error">{String(err)}</div>}
        >
            {() => (
                <Caller
                    callback={(init) => init.trackSignals([], () => {})}
                    handleError={deferred.resolve}
                />
            )}
        </ErrorBoundary>
    ));

    const err = await deferred.promise;

    expect(err).toHaveProperty(
        'message',
        'trackSignals must only be called during init phase.',
    );

    res.dispose();
});
