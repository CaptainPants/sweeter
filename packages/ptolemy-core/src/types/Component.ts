import { type ComponentInit } from './ComponentInit.js';
import {
    type NoProps,
    type PropertyMap,
    type PropsParam,
} from './propTypes.js';

export type Component<TProps = NoProps> = {
    (props: PropsParam<TProps>, init: ComponentInit): JSX.Element;

    propMappings?: PropertyMap<PropsParam<TProps>>;
};
