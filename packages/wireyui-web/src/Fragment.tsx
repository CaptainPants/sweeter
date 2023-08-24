import { Component, WireyUINode } from "@captainpants/wireyui-core";

export interface FragmentProps {
    children?: WireyUINode;
}

/**
 * TODO: a real implementation, currently its just a div
 * @param props 
 * @param context 
 * @returns 
 */
export const Fragment: Component<FragmentProps> = (props, context) => {
    return <div>
        {props.children}
    </div>;
}