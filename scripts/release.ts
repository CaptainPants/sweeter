import { execSync } from "child_process";
import { exit } from "process";

const args = process.argv.slice(2);

if (args.length < 1) {
    throw new Error('Expected at least one argument');
}

const [ver, dryRun = true] = args;

const debug = false;

function output(text: string) {
    console.log(text);
}

function run(command: string, writeOutput = true): string {
    if (debug) {
        console.log('RUNNING ', command);
        return '';
    }
    const res = execSync(command, { encoding: 'utf-8' });
    if (writeOutput){
        output(res);
    }
    return res;
}

const currentBranch = run('git rev-parse --abbrev-ref HEAD', false);
output(`Releasing based on branch ${currentBranch}.`);

const diff = run('git diff --name-only --raw', false)?.trim();
const changedFiles = diff === '' ? [] : diff.split('\n');
if (changedFiles.length > 0) {
    output(`Changes found, please commit or revert them to continue: \n- ${changedFiles.join('\n- ')}`);
    exit(0);
}

run('git branch temp_release -m -f');

run(`pnpm run set-versions ${ver}`);

run('git add -A');
run('git commit -m "Version numbers"');

if (dryRun) {
    output('PUBLISHING (DRY RUN)');
    run('pnpm run publish-all:dry-run');
}
else {
    output('PUBLISHING (REAL)');
    run('pnpm run publish-all:dry-run');
}

exit(0);