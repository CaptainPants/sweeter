import type { Signal } from '@captainpants/wireyui-core';
import {
    ErrorBoundaryContext,
    addStrongReference,
    saveExecutionContext,
} from '@captainpants/wireyui-core';
import { append } from './append.js';
import { appendJsxChildren } from './appendJsxChildren.js';

export function addSignalJsxChild(
    parent: Node,
    after: Node | null,
    childSignal: Signal<JSX.Element>,
): Node {
    let lastValue = childSignal.value;

    // JSX.Element signals use a Comment as the start/end
    // marker as they do not participate in layout.
    const startMarker = document.createComment('{');
    const endMarker = document.createComment('}');

    after = append(parent, after, startMarker);
    after = appendJsxChildren(parent, after, lastValue);
    append(parent, after, endMarker);

    // TODO: dynamic text is currently getting removed and re-added,
    // and thats not great for performance. We need to do some kind of
    // reconciliation to take that into account.

    // I think that flatten probably needs to return an array/callback
    // (which is then in turn returned by appendJsxChildren) that can
    // be used to reconcile between runs.

    const context = saveExecutionContext();

    const dynamicJsxChildCleanupAndReplace = () => {
        context.invoke(() => {
            try {
                const thisValue = childSignal.value;

                // From 'startMarker', delete all nextSiblings until 'endMarker'
                let current = startMarker.nextSibling;

                while (current && current != endMarker) {
                    parent.removeChild(current);

                    current = startMarker.nextSibling;
                }

                appendJsxChildren(parent, startMarker, thisValue);

                lastValue = thisValue;
            } catch (ex) {
                ErrorBoundaryContext.getCurrent().error(ex);
                throw ex; // this is swallowed anyway
            }
        });
    };

    // Signal could be used in more than one place, so we want
    // to allow this listener to be collected (hence weak)
    childSignal.listen(dynamicJsxChildCleanupAndReplace, false);

    // But add a strong reference to the handler on the DOM
    // element so it will be cleaned up when possible
    addStrongReference(parent, dynamicJsxChildCleanupAndReplace);

    return endMarker;
}
