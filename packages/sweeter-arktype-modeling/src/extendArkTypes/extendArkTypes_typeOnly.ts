import { $ark, BaseRoot } from "@ark/schema";

import { addFunctionsToSchemaNode } from "./add.js";

export function extendArkTypes_typeOnly() {
    // This doesn't seem to be needed, but keep the code just in case
    // for (const thing of Object.values($ark.intrinsic)) {
    //     addFunctionsToSchemaNode(thing as never);
    // }
    
    // This needs to be last 
    addFunctionsToSchemaNode(BaseRoot.prototype as never);
}