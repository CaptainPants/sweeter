import { type ComponentInit } from "./ComponentInit.js";
import { type NoProps, type PropsDef } from "./propTypes.js";

// TODO: strongly type this if possible...
export type ComponentPropMappings<TProps> = Partial<
    Record<keyof TProps, false | ((raw: unknown) => unknown)>
>;

export type Component<TProps = NoProps> = {
    (props: PropsDef<TProps>, init: ComponentInit): JSX.Element;

    propMapping?: ComponentPropMappings<TProps>;
};