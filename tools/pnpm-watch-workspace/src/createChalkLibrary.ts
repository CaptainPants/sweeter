import chalk, { type ChalkInstance } from "chalk";

export interface ChalkSet {
    prefix: ChalkInstance;
    header: ChalkInstance;
}

export interface ChalkLoan {
    chalk: Readonly<ChalkSet>;
    return(): void;
}

const baseSets: ChalkSet[] = [
    { prefix: chalk.blue, header: chalk.bgBlue },
    { prefix: chalk.cyan, header: chalk.bgCyan },
    { prefix: chalk.magenta, header: chalk.bgMagenta },
    { prefix: chalk.yellow, header: chalk.bgYellow },
    { prefix: chalk.white, header: chalk.bgWhite },
];

const fallback: ChalkSet = {
    prefix: chalk.white,
    header: chalk.black.bgWhite
};

export function createChalkLibrary() {
    const chalks = new Set(baseSets);

    function rent(): ChalkLoan {
        if (chalks.size === 0) {
            return {
                chalk: fallback,
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