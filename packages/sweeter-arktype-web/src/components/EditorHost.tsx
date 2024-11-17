import * as assert from 'typed-assert';

import {
    type ContextualValueCalculationContext,
    createTypeMatcher,
    type TypeMatcherRule,
    notFound,
} from '@captainpants/arktype-modeling';
import {
    $calc,
    $constant,
    $peek,
    $val,
    $valProperties,
    $wrap,
    type ComponentInit,
} from '@captainpants/sweeter-core';

import { AmbientValues } from './AmbientValues.js';
import {
    type EditorComponentType,
    type EditorHostProps,
    type RenderNextFunction,
    type RenderNextFunctionArgs,
} from '../types.js';
import { SetupContextualValueCallbacksHook } from '../hooks/SetupContextualValueCallbacksHook.js';
import { EditorRootContext } from '../context/EditorRootContext.js';
import { z } from 'vitest/dist/reporters-5f784f42.js';

// eslint-disable-next-line @typescript-eslint/ban-types
const Last = (props: {}, init: ComponentInit): JSX.Element => {
    return <div>No match</div>;
};

function createRenderFunction(
    matches: Array<TypeMatcherRule<EditorComponentType>>,
): RenderNextFunction {
    // This is a failure case, when no final editor has stopped deputizing rendering to the next in the pipeline
    let renderFunction: RenderNextFunction = () => {
        return <Last />;
    };

    // In reverse order from last to first, create a render function that calls the next ('previous' in reverse) render function as its 'next'
    for (let i = matches.length - 1; i >= 0; --i) {
        const Editor = matches[i]?.result;
        assert.isNotUndefined(Editor);

        const innerNext = renderFunction;

        renderFunction = (props) => {
            return <Editor {...props} next={innerNext} />;
        };
    }

    return renderFunction;
}

/**
 * Renders an editor for a model within another editor.
 */
export function EditorHost(
    props: EditorHostProps,
    init: ComponentInit,
): JSX.Element;
export function EditorHost(
    { model, local: localProp, ...passThroughToRenderProps }: EditorHostProps,
    init: ComponentInit,
): JSX.Element {
    const { rules, settings } = init.getContext(EditorRootContext);

    const calculateLocal = (
        name: string,
        context: ContextualValueCalculationContext,
    ) => {
        const modelResolved = $val(model);

        // Look at the model, and then the parent's property model (which is passed via the localProp)
        const found = modelResolved.type
            .annotations()
            .getLocalValueForUnknown(name, modelResolved, context);
        if (found !== notFound) {
            return found;
        }

        const localPropResolved = $peek(localProp);
        if (!localPropResolved) {
            return notFound;
        }

        return localPropResolved(name);
    };

    const calculateAmbient = (
        name: string,
        context: ContextualValueCalculationContext,
    ) => {
        const modelResolved = $val(model);

        return modelResolved.type
            .annotations()
            .getAmbientValueForUnknown(name, modelResolved, context);
    };

    const { ambient, local } = init.hook(
        SetupContextualValueCallbacksHook,
        calculateLocal,
        calculateAmbient,
    );

    const type = $calc(() => $val(model).type);
    const parentInfo = $calc(() => $val(model).parentInfo);

    const render = $calc(() => {
        const matches = createTypeMatcher<EditorComponentType>(
            rules,
        ).findAllMatches(
            { settings },
            {
                type: type.value,
                parentInfo: parentInfo.value,
            },
        );

        return createRenderFunction(matches);
    });

    return $calc(() => {
        const args: RenderNextFunctionArgs = Object.assign(
            {},
            $valProperties(passThroughToRenderProps),
            {
                model,
                local,
                settings,
            },
        );

        return (
            <AmbientValues callback={ambient}>
                {() => {
                    return render.value(args);
                }}
            </AmbientValues>
        );
    });
}