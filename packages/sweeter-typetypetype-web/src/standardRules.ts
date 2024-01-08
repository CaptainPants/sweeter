import { createDefaultRulesSet } from './createDefaultRulesSet.js';
import { RigidObjectEditor } from './editors/RigidObjectEditor.js';
import { TextEditor } from './editors/TextEditor.js';

export const muiStandardRules = createDefaultRulesSet({
    rigidObject: RigidObjectEditor,
    //mapObject: MuiMapObjectEditor,
    string: TextEditor,
    // number: MuiNumberEditor,
    // boolean: MuiBooleanEditor,
    // array: MuiArrayEditor,
    // union: MuiUnionEditor,
    // constant: MuiConstantEditor,
});
