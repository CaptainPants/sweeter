import { type Styles } from '../../IntrinsicAttributes.js';

// TODO: implement style binding
export function bindStyle(node: HTMLElement | SVGElement, styles: Styles) {
    for (const key of Object.getOwnPropertyNames(styles)) {
        const value = styles[key as keyof Styles] as string;

        node.style.setProperty(key, value);
    }
}
