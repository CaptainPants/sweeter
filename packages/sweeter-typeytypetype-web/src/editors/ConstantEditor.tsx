import { TextArea } from '@captainpants/sweeter-gummybear';
import { type EditorProps } from '../types.js';
import { $calc, $lastValid, $val } from '@captainpants/sweeter-core';

export function ConstantEditor({ model }: Readonly<EditorProps>): JSX.Element {
    return (
        <TextArea
            disabled
            fillWidth
            readOnly
            value={$lastValid(() => String($val(model).value))}
        />
    );
}
