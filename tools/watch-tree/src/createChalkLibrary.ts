import chalk, { type ChalkInstance } from "chalk";

export interface ChalkLoan {
    chalk: ChalkInstance;
    return(): void;
}

export function createChalkLibrary() {
    const chalks: Set<ChalkInstance> = new Set([
        chalk.blue,
        chalk.cyan,
        chalk.magenta,
        chalk.yellow,
        chalk.white
    ]);

    function rent(): ChalkLoan {
        if (chalks.size === 0) {
            return {
                chalk: chalk.white,
                return: () => void 0
            };
        }

        const next = first(chalks.values());
        if (next === undefined) throw new Error('Unexpected');
        chalks.delete(next);
        let returned = false;
        return {
            chalk: next,
            return: () => {
                if (returned) return;
                
                chalks.add(next);
                returned = true;
            }
        }
    }

    return {
        loan: rent
    }
}

function first<T>(iterable: Iterable<T>): T | undefined {
    for (const item of iterable) {
        return item;
    }
    return undefined;
}