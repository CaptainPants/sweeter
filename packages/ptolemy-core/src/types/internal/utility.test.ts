import { typeAssert } from '@serpentis/ptolemy-utilities';

import { type Signal } from '../../signals/types.js';
import { type Prop } from '../propTypes.js';

import {
    type PropertiesThatRequireMapping,
    type PropertyMapping,
    type PropertyMappingSubset,
} from './utility.js';

interface Example1 {
    str1: string;
    str2: string;
}
interface Example2 {
    str1: string;
    str2: string;
    str3: Prop<string, string>;
    str4: Prop<string, Signal<string>>;
}

test('MappedProperties', () => {
    typeAssert.equal<PropertiesThatRequireMapping<Example2>, 'str3'>();
});

test('PropertyMappingSubset', () => {
    typeAssert.equal<
        PropertyMappingSubset<Example1>,
        { propMappings?: never }
    >();
    typeAssert.equal<
        PropertyMappingSubset<Example2>,
        { propMappings: PropertyMapping<Example2> }
    >();
});
