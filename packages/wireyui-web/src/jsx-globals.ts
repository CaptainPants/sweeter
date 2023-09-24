import { KeysMatching } from '@captainpants/wireyui-core';

type PrefixedNames<
    TNames extends string,
    TPrefix extends string,
> = TNames extends `${TPrefix}${infer S}` ? S : never;

type EventHandlerNames = PrefixedNames<keyof HTMLElement, 'on'>;

type ExcludedSimpleProperties = 'innerHTML' | 'innerText' | 'outerText';

type SimpleTypedPropertyNames = Exclude<KeysMatching<
    HTMLElement,
    string | number | boolean
>, ExcludedSimpleProperties>;

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            div: JSX.CommonAttributes;
        }

        interface CommonAttributeParts {
            'wireyui-web': Partial<
                Pick<HTMLElement, `on${EventHandlerNames}`>
            > &
                Partial<Pick<HTMLElement, SimpleTypedPropertyNames>>;
        }

        /**
         * Extends off the same from wireyui-core to populate JSX.Element
         */
        interface ElementAlternatives {
            'wireyui-web': HTMLElement | SVGElement;
        }
    }
}
