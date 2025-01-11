import { $lastGood, $val } from '@captainpants/sweeter-core';
import { TextArea } from '@captainpants/sweeter-web-gummybear';

import { type EditorProps } from '../types.js';

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
