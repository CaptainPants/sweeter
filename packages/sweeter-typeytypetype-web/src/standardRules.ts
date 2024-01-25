import { createDefaultRulesSet } from './createDefaultRulesSet.js';
import { ArrayEditor } from './editors/ArrayEditor.js';
import { RigidObjectEditor } from './editors/RigidObjectEditor.js';
import { TextEditor } from './editors/TextEditor.js';
import { ConstantEditor, NumberEditor, BooleanEditor } from './index.js';

export const standardRules = createDefaultRulesSet({
    rigidObject: RigidObjectEditor,
    //mapObject: MuiMapObjectEditor,
    string: TextEditor,
    number: NumberEditor,
    boolean: BooleanEditor,
    array: ArrayEditor,
    // union: MuiUnionEditor,
    constant: ConstantEditor,
});
