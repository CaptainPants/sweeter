import { createDefaultRulesSet } from './createDefaultRulesSet.js';
import { ArrayEditor } from './editors/ArrayEditor.js';
import { MapObjectEditor } from './editors/MapObjectEditor.js';
import { RigidObjectEditor } from './editors/RigidObjectEditor.js';
import { TextEditor } from './editors/TextEditor.js';
import { UnionEditor } from './editors/UnionEditor.js';
import { ConstantEditor, NumberEditor, BooleanEditor } from './index.js';

export const standardRules = createDefaultRulesSet({
    rigidObject: RigidObjectEditor,
    mapObject: MapObjectEditor,
    string: TextEditor,
    number: NumberEditor,
    boolean: BooleanEditor,
    array: ArrayEditor,
    union: UnionEditor,
    constant: ConstantEditor,
});
