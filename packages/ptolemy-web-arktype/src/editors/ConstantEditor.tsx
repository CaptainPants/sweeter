import { $lastGood, $val } from '@serpentis/ptolemy-core';
import { TextArea } from '@serpentis/ptolemy-web-stardust';

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
