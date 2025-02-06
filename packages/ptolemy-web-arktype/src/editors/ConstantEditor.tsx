import { $lastGood, $val, Component } from '@serpentis/ptolemy-core';
import { TextArea } from '@serpentis/ptolemy-web-stardust';

import { type EditorProps } from '../types.js';

export const ConstantEditor: Component<EditorProps> = ({ model }) => {
    return (
        <TextArea
            disabled
            fillWidth
            readOnly
            value={$lastGood(() => String($val(model).value))}
        />
    );
};
