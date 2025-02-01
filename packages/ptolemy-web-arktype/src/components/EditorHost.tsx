import {
    type ContextualValueCalculationContext,
    createTypeMatcher,
    notFound,
    type TypeMatcherRule,
} from '@serpentis/ptolemy-arktype-modeling';
import {
    $derived,
    $val,
    $valProperties,
    Component,
    type ComponentInit,
} from '@serpentis/ptolemy-core';
import { assertNotNullOrUndefined } from '@serpentis/ptolemy-utilities';

import { EditorRootContext } from '../context/EditorRootContext.js';
import { SetupContextualValueCallbacksHook } from '../hooks/SetupContextualValueCallbacksHook.js';
import {
    type EditorComponentType,
    type EditorHostProps,
    type RenderNextFunction,
    type RenderNextFunctionArgs,
} from '../types.js';

import { AmbientValues } from './AmbientValues.js';

const Last: Component = (): JSX.Element => {
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
export const EditorHost: Component<EditorHostProps> = (
    { model, local: localProp, ...passThroughToRenderProps },
    init: ComponentInit,
) => {
    const { rules, settings } = init.getContext(EditorRootContext);

    const modelType = $derived(() => {
        return model.value.type;
    });
    const parentInfo = $derived(() => {
        return model.value.parentInfo;
    });

    const calculateLocal = (
        name: string,
        context: ContextualValueCalculationContext,
    ) => {
        // Look at the model, and then the parent's property model (which is passed via the localProp)
        const found = modelType.value
            .annotations()
            ?.getAssociatedValue(name, model, context);
        if (found !== notFound) {
            return found;
        }

        const localPropResolved = localProp?.peek();
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
