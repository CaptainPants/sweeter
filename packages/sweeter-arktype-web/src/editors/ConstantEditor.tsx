import { TextArea } from '@captainpants/sweeter-gummybear';
import { type EditorProps } from '../types.js';
import { $lastGood, $val } from '@captainpants/sweeter-core';

export function ConstantEditor({ model }: Readonly<EditorProps>): JSX.Element {
    return (
        <TextArea
            disabled
            fillWidth
            readOnly
            value={$lastGood(() => String($val(model).value))}
        />
    );
}
