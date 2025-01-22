
import * as path from 'path';
import * as fs from 'fs';

const filePath = path.resolve(process.argv[2]);

const dir = path.dirname(filePath);
let viteconf = undefined;

let current = dir; // find the relevant vite.config.js by searching upwards
while(current) {
    const candidate = path.join(current, 'vite.config.js');
    if (fs.existsSync(candidate)) {
        viteconf = candidate;
        break;
    }

    current = path.dirname(current);
}

if (!viteconf) {
    console.error('Could not find config file.');
    process.exit(1);
}

process.chdir(dir);

// Rewrite
const scriptPath = path.resolve("./node_modules/vitest/vitest.mjs");
process.argv = [
    process.argv[0], // node
    scriptPath, // script path
    "run", 
    filePath, // test file
    "--globals",
    "--config",
    viteconf
];

await import("./node_modules/vitest/vitest.mjs");