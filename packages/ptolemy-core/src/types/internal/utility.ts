import { type Signal } from '../../signals/types.js';
import { type Prop } from '../propTypes.js';

export type PropertiesThatRequireMapping<TProps> = {
    [Key in keyof TProps]: TProps[Key] extends Prop<infer TInput, infer TOutput>
        ? TOutput extends Signal<TInput>
            ? never
            : Key
        : never;
}[keyof TProps];

// TODO: THIS IS NEXT
export type PropertyMapping<TProps> = { test: TProps };

export type PropertyMappingSubset<TProps> = [
    PropertiesThatRequireMapping<TProps>,
] extends [never]
    ? unknown
    : { propMappings: PropertyMapping<TProps> };
