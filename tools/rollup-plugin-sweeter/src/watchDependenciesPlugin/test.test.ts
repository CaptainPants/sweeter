import { gatherDependencies } from "./watchDependenciesPlugin.js"

test('banana', async () => {
    for (const { name, realPath } of await gatherDependencies('K:\\Workspaces\\sweeter\\examples\\rollup-sweeter-plugin-usage\\node_modules')) {
        console.log(' >> ' + name + ' ::: ' + realPath);
    }
}, 30000)