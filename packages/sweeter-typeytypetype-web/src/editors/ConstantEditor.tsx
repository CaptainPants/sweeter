import { TextArea } from '@captainpants/sweeter-gummybear';
import { type EditorProps } from '../types.js';

export function ConstantEditor({ model }: Readonly<EditorProps>): JSX.Element {
    return <TextArea disabled fillWidth readOnly value={String(model.value)} />;
}
