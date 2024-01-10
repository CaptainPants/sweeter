import * as assert from 'typed-assert';

import {
    type ContextualValueCalculationContext,
    createTypeMatcher,
    type TypeMatcherRule,
} from '@captainpants/typeytypetype';
import {
    $calc,
    $peek,
    $val,
    $valObjectValues,
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

// eslint-disable-next-line @typescript-eslint/ban-types
const Last = (props: {}, init: ComponentInit): JSX.Element => {
    return <div>No match</div>;
};

function createRenderFunction(
    matches: Array<TypeMatcherRule<EditorComponentType>>,
): RenderNextFunction {
    let renderFunction: RenderNextFunction = (_props) => {
        return <Last />;
    };

    // In reverse order from last to first, create a render function that calls the next latest render function as its 'next'
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
    { model, local: localProp, ...rest }: EditorHostProps,
    init: ComponentInit,
): JSX.Element {
    const { rules, settings } = init.getContext(EditorRootContext);

    const calculateLocal = (
        name: string,
        context: ContextualValueCalculationContext,
    ) => {
        // Look at the model, and then the parent's property model (which is passed via the localProp)
        const found = $peek(model).type.getLocalValueForUnknown(
            name,
            $peek(model),
            context,
        );
        if (found !== undefined) return found;
        return $peek(localProp)?.(name) ?? undefined;
    };
    const calculateAmbient = (
        name: string,
        context: ContextualValueCalculationContext,
    ) => {
        return $peek(model).type.getAmbientValueForUnknown(
            name,
            $peek(model),
            context,
        );
    };

    const { ambient, local } = init.hook(
        SetupContextualValueCallbacksHook,
        calculateLocal,
        calculateAmbient,
    );

    return $calc(() => {
        const resolvedModel = $val(model);

        const matches = createTypeMatcher<EditorComponentType>(
            rules,
        ).findAllMatches(
            { settings },
            {
                type: resolvedModel.type,
                parentInfo: resolvedModel.parentInfo,
            },
        );

        const render = createRenderFunction(matches);

        const args: RenderNextFunctionArgs = Object.assign(
            {},
            $valObjectValues(rest),
            {
                model,
                local,
                settings,
            },
        );

        return (
            <AmbientValues callback={ambient}>
                {() => {
                    return render(args);
                }}
            </AmbientValues>
        );
    });
}
