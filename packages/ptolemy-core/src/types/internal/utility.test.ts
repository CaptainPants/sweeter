import { typeAssert } from '@serpentis/ptolemy-utilities';

import { type Signal } from '../../signals/types.js';
import { type Prop } from '../propTypes.js';

import {
    type PropertiesThatRequireMapping,
    PropOutputFromParam,
    PropOutputFromRaw,
    RemoveUndefined,
} from './utility.js';

interface Example1 {
    str1: string;
    str2: Prop<string, string>;
    str3: Prop<string, Signal<string>>; // This is the default mapping, so doesn't need a mapping function
    str4?: Prop<string | undefined, string>; // NOTE: if your prop is optional the input type should include undefined
}
// interface Example1Param {
//     str1: Signal<string>;
//     str2: Prop<string, string>;
//     str3: Prop<string, Signal<string>>;
//     str4: string;
// }

test('RemoveUndefined', () => {
    typeAssert.equal<
        RemoveUndefined<'str1' | 'str2' | undefined>,
        'str1' | 'str2'
    >();
    typeAssert.equal<RemoveUndefined<'str1' | 'str2'>, 'str1' | 'str2'>();
});

test('PropertiesThatRequireMapping', () => {
    typeAssert.equal<PropertiesThatRequireMapping<Example1>, 'str2' | 'str4'>();
});

test('PropOutputFromParam', () => {
    typeAssert.equal<PropOutputFromParam<Example1['str1']>, string>();
    typeAssert.equal<PropOutputFromParam<Example1['str2']>, string>();
    typeAssert.equal<PropOutputFromParam<Example1['str3']>, Signal<string>>();
    typeAssert.equal<
        PropOutputFromParam<Example1['str4']>,
        string | undefined
    >();
});

test('PropOutputFromRaw', () => {
    typeAssert.equal<PropOutputFromRaw<Example1['str1']>, Signal<string>>();
    typeAssert.equal<PropOutputFromRaw<Example1['str2']>, string>();
    typeAssert.equal<PropOutputFromRaw<Example1['str3']>, Signal<string>>();
    typeAssert.equal<PropOutputFromRaw<Example1['str4']>, string | undefined>();
});
