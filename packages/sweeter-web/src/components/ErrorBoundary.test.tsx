/* @jsxImportSource .. */

import { ErrorBoundary, $calc } from '@captainpants/sweeter-core';
import { testRender } from '../test/testRender.js';

it('ErrorBoundary displays content when no error', () => {
    const res = testRender(() => (
        <ErrorBoundary renderError={(err) => <div>ERROR</div>}>
            {() => <div>Nothing to see here</div>}
        </ErrorBoundary>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});

it('ErrorBoundary displays error when error thrown during render', () => {
    const res = testRender(() => (
        <ErrorBoundary
            renderError={(err) => <div>{(err as Error).message}</div>}
        >
            {() => {
                throw new Error('Failed to render');
            }}
        </ErrorBoundary>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});

it('ErrorBoundary displays error when error thrown during render (signal)', () => {
    const res = testRender(() => (
        <ErrorBoundary
            renderError={(err) => <div>{(err as Error).message}</div>}
        >
            {() =>
                $calc(() => {
                    throw new Error('Failed to render');
                })
            }
        </ErrorBoundary>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});

// TODO: clearing an error boundary?
