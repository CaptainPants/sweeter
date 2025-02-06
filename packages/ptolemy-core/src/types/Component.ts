import { type ComponentInit } from './ComponentInit.js';
import { RequiredPropMappingsIfAny } from './internal/utility.js';
import {
    type NoProps,
    type PropertyMap,
    type PropsParam,
} from './propTypes.js';

export type Component<TProps = NoProps> = {
    (props: PropsParam<TProps>, init: ComponentInit): JSX.Element;

    propMappings?: PropertyMap<PropsParam<TProps>>;
} & RequiredPropMappingsIfAny<PropsParam<TProps>>;
