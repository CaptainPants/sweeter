
import * as types from './types.js';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
    namespace JSX {
        type Element = types.Element;
        type IntrinsicAttributes = types.IntrinsicAttributes;  
        
        interface ElementChildrenAttribute {
            // eslint-disable-next-line @typescript-eslint/ban-types
            children: {}; // specify children name to use
        }
    }
}