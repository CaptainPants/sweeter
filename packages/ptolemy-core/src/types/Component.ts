import { type ComponentInit } from './ComponentInit.js';
import { PropertyMappingSubset } from './internal/utility.js';
import { type NoProps, type PropsDef } from './propTypes.js';

export type Component<TProps = NoProps> = {
    (props: PropsDef<TProps>, init: ComponentInit): JSX.Element;
} & PropertyMappingSubset<TProps>;
