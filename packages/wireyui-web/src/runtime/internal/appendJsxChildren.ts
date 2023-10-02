import type { FlattenedElement } from '@captainpants/wireyui-core';
import { flatten, isSignal } from '@captainpants/wireyui-core';
import { addSignalJsxChild } from './addSignalJsxChild.js';
import { append } from './append.js';

export function appendJsxChildren(
    parent: Node,
    after: Node | null,
    children: JSX.Element,
): Node | null {
    let last: Node | null = after;

    const callback = (child: FlattenedElement) => {
        if (isSignal(child)) {
            last = addSignalJsxChild(parent, last, child);
            return;
        }

        switch (typeof child) {
            case 'undefined':
                break;

            case 'number':
            case 'boolean':
            case 'string':
                last = append(
                    parent,
                    last,
                    document.createTextNode(String(child)),
                );
                return;

            default:
                last = append(parent, last, child);
                return;
        }
    };

    flatten(children, callback);

    return last;
}
