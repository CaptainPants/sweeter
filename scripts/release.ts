import { input } from '@inquirer/prompts';
import chalk from 'chalk';
import { execSync, spawn } from "child_process";
import { Command, program } from 'commander';
import { stdout } from "process";

function output(text: string) {
    stdout.write(text + '\n');
}
function banner(text: string) {
    stdout.write(chalk.bgBlue(` ==== ${text} ==== `) + '\n');
}

function runAndReturn(command: string, { writeOutput = true, logCommand = false } = {}): string {
    if (logCommand) {
        output('Running> ' + command);
    }

    const res = execSync(command, { encoding: 'utf-8' });
    if (writeOutput){
        output(res);
    }
    return res;
}

async function runAsyncWithStdoutPassthrough(command: string): Promise<void> {
    return new Promise<void>(
        (resolve, reject) => {
            const proc = spawn(command, { stdio: "inherit", shell: true });

            proc.on('close', (code, signal) => code == 0 ? resolve(void 0) : reject(new Error(`Killed ${code} (${signal})`)));
        }
    )
}

const publishCommands = {
    dryRunReleaseCommand: 'pnpm run publish-all:dry-run',
    realReleaseCommand: 'pnpm run publish-all:dry-run',
    upgradedRelease: 'pnpm run publish-all:unsafe-as-is'
};

async function main(this: Command, { version, dryRun = true, interactive = true }: Options): Promise<void> {
    banner(`Releasing version ${version} (${(dryRun ? 'DRY RUN' : 'REAL / NOT A TEST')})`);

    const currentBranch = runAndReturn('git rev-parse --abbrev-ref HEAD', { writeOutput: false }).trim();
    banner(`Based on branch ${currentBranch}.`);

    const diff = runAndReturn('git diff --name-only --raw', { writeOutput: false })?.trim();
    const changedFiles = diff === '' ? [] : diff.split('\n');
    if (changedFiles.length > 0) {
        const message = `Changes found, please commit or revert them to continue: \n- ${changedFiles.join('\n- ')}`;
        this.error(message);
        return;
    }

    try {
        runAndReturn('git branch temp_release -c -f');
        runAndReturn('git switch temp_release');

        runAndReturn(`pnpm run set-versions ${version}`);

        runAndReturn('git add -A');
        runAndReturn('git commit -m "Version numbers"');

        if (dryRun) {
            banner('Publishing (DRY RUN)');
            await runAsyncWithStdoutPassthrough(publishCommands.dryRunReleaseCommand);

            if (interactive) {
                const upgradePromptInput = await input({ message: 'Dry run successful, do you want to upgrade to REAL release? (y/n*)' });

                // Allow Y or Y, anything else is a no
                const upgrade = upgradePromptInput === 'y' || upgradePromptInput === 'Y';

                if (upgrade) {
                    banner('Upgraded: Publishing (REAL)');
                    await runAsyncWithStdoutPassthrough(publishCommands.upgradedRelease);
                }
            }
        }
        else {
            banner('Publishing (REAL)');
            await runAsyncWithStdoutPassthrough(publishCommands.realReleaseCommand);
        }

    }
    finally {
        banner('Finished');
        // Return to original branch
        runAndReturn(`git switch ${currentBranch}`, { logCommand: true });
    }

    return;
}

interface Options {
    version: number | undefined;
    dryRun: boolean;
    interactive: boolean | undefined;
}

program.description('release.ts - Ptolemy release process');

program
    .option(
        '-v, --version <version>',
        'Version number to use'
    )
    .option(
        '--dryrun <dryRun>',
        'Version number to use'
    )
    .hook('preAction', async (_, actionCommand) => {
        // Any missing parameters that can be meaningfully input by the user

        const readVersion = actionCommand.getOptionValue('version') as string | undefined;
        if (!readVersion) {
            const prompted = await input({ message: 'Enter version number to use' });
            actionCommand.setOptionValue('version', prompted);
        }
    })
    .action(main);

await program.parseAsync();