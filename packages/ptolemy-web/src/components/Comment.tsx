/* @jsxImportSource .. */

import {
    afterCalculationsComplete,
    Component,
    ComponentFaultContext,
    isSignal,
    listenWhileNotCollected,
    Signal,
    SignalState,
} from '@serpentis/ptolemy-core';

import { getWebRuntime } from '../runtime/getWebRuntime.js';

export interface CommentProps {
    content?: string | undefined;
}

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
