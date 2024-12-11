import { createDefaultRulesSet } from './createDefaultRulesSet.js';
import { ArrayEditor } from './editors/ArrayEditor.js';
import { BooleanEditor } from './editors/BooleanEditor.js';
import { ConstantEditor } from './editors/ConstantEditor.js';
import { NumberEditor } from './editors/NumberEditor.js';
import { ObjectEditor } from './editors/ObjectEditor.js';
import { TextEditor } from './editors/TextEditor.js';
import { UnionEditor } from './editors/UnionEditor.js';

export const standardRules = createDefaultRulesSet({
    rigidObject: ObjectEditor,
    string: TextEditor,
    number: NumberEditor,
    boolean: BooleanEditor,
    array: ArrayEditor,
    union: UnionEditor,
    constant: ConstantEditor,
});
