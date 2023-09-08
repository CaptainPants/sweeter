import { JSXElement } from '@captainpants/wireyui-core';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            div: { id?: string | undefined; children?: JSXElement };
            cored: { banana: number };
        }

        /**
         * This is not standard. I am hoping that by structuring in this way we
         * can use declaration merging to extend the definition of Element.
         */
        interface ElementAlternatives { 
            html: HTMLElement;
            svg: SVGElement;
        }
        
        //type Element = ElementType<ElementAlternatives>;
    }
}

export {};
