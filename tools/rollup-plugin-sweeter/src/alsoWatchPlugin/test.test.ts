import { createFilter } from "@rollup/pluginutils";

test('test', () => {
    const include: string[] = [
        '*/dist/**/*'
    ];
    const exclude: string[] = [

    ];

    const file = 'C:\\workspace\\sweeter\\examples\\rollup-sweeter-plugin-usage\\node_modules\\@captainpants\\rollup-plugin-sweeter\\dist\\index.js';

    const filter = createFilter(include, exclude, { resolve: 'C:\\workspace\\sweeter\\examples\\rollup-sweeter-plugin-usage\\node_modules\\@captainpants' });

    const res = filter(file);

    const y = 0;
})