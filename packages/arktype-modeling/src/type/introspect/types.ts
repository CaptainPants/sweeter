import { BaseNode, Domain, Proto, Structure, Union, Unit } from "@ark/schema";

export interface InterrogableNode extends BaseNode {
    inner: {
        domain?: Domain.Node | undefined;
        unit?: Unit.Node | undefined;
        structure?: Structure.Node | undefined;
        proto?: Proto.Node | undefined;
        branches?: BaseNode[];
    }
}