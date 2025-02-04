import { type Expand } from 'type-expand';

import { typeAssert } from '@serpentis/ptolemy-utilities';

import {
    type Prop,
    type PropertyMap,
    type PropsInputFromParam,
} from './propTypes.js';

interface Example1 {
    str1: string;
    str2?: Prop<string | undefined, string>;
}

test('PropsInputFromParam', () => {
    typeAssert.equal<
        Expand<PropsInputFromParam<Example1>>,
        { str1: string; str2?: string | undefined }
    >();
});

test('PropertyMap', () => {
    typeAssert.equal<
        PropertyMap<Example1>,
        {
            str2: (input: string | undefined) => string | undefined;
        }
    >();
});
