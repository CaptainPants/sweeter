import { TextArea } from '@captainpants/sweeter-gummybear';
import { type EditorProps } from '../types.js';
import { $calc, $val } from '@captainpants/sweeter-core';

export function ConstantEditor({ model }: Readonly<EditorProps>): JSX.Element {
    return (
        <TextArea
            disabled
            fillWidth
            readOnly
            value={$calc(() => String($val(model).value))}
        />
    );
}
