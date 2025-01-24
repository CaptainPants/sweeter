/* @jsxImportSource .. */

import { $derived, ErrorBoundary } from '@serpentis/ptolemy-core';

import { testRender } from '../test/testRender.js';

it('ErrorBoundary displays content when no error', () => {
    const res = testRender(() => (
        <ErrorBoundary renderError={(_err) => <div>ERROR</div>}>
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
                $derived(() => {
                    throw new Error('Failed to render');
                })
            }
        </ErrorBoundary>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
