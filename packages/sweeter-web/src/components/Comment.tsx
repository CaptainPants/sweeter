/* @jsxImportSource .. */

import {
    afterCalculationsComplete,
    Component,
    ComponentFaultContext,
    isSignal,
    listenWhileNotCollected,
    PropertiesMightBeSignals,
    Signal,
    SignalState,
} from '@captainpants/sweeter-core';

import { getWebRuntime } from '../runtime/getWebRuntime.js';

export type CommentProps = PropertiesMightBeSignals<{
    content?: string | undefined;
}>;

export const Comment: Component<CommentProps> = ({ content }, init) => {
    const comment = getWebRuntime().createComment();
    const faultContext = init.getContext(ComponentFaultContext);

    if (isSignal(content)) {
        listenWhileNotCollected(comment, content, (nextState) => {
            afterCalculationsComplete(() => {
                try {
                    comment.textContent =
                        SignalState.getValue(nextState) ?? null;
                } catch (err) {
                    faultContext.reportFaulted(err);
                }
            });
        });
    } else {
        comment.textContent = content ?? null;
    }

    return comment;
};

export function $comment(
    content: string | Signal<string | undefined> | undefined,
) {
    return <Comment content={content} />;
}
