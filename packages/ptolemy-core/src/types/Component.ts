import { type ComponentInit } from './ComponentInit.js';
import { PropertyMap } from './internal/utility.js';
import { type NoProps, type PropsParam } from './propTypes.js';

export type Component<TProps = NoProps> = {
    (props: PropsParam<TProps>, init: ComponentInit): JSX.Element;

    propMappings?: PropertyMap<TProps>;
};
