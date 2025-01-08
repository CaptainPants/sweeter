import {
    type ContextualValueCalculationContext,
    createTypeMatcher,
    type TypeMatcherRule,
    notFound,
} from '@captainpants/sweeter-arktype-modeling';
import {
    $constant,
    $derived,
    $peek,
    $val,
    $valProperties,
    isSignal,
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
import { assertNotNullOrUndefined } from '@captainpants/sweeter-utilities';

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
        assertNotNullOrUndefined(Editor);

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

    if (!isSignal(model)) {
        model = $constant(model);
    }
    const modelType = $derived(() => {
        return $val(model).type;
    });
    const parentInfo = $derived(() => {
        return $val(model).parentInfo;
    });

    const calculateLocal = (
        name: string,
        context: ContextualValueCalculationContext,
    ) => {
        // Look at the model, and then the parent's property model (which is passed via the localProp)
        const found = $val(modelType)
            .annotations()
            ?.getAssociatedValue(name, model, context);
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
        return $val(modelType)
            .annotations()
            ?.getAmbientValue(name, model, context);
    };

    const { ambient, local } = init.hook(
        SetupContextualValueCallbacksHook,
        calculateLocal,
        calculateAmbient,
    );

    const render = $derived(() => {
        const matches = createTypeMatcher<EditorComponentType>(
            rules,
        ).findAllMatches(
            { settings },
            {
                type: modelType.value,
                parentInfo: parentInfo.value,
            },
        );

        return createRenderFunction(matches);
    });

    return $derived(() => {
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
