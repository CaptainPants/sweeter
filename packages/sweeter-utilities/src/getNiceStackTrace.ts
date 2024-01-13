/*
Example:
Error
    at getNiceStackTrace (http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-utilities/build/index.js?t=1705104034061:141:17)
    at new CalculatedSignal (http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705105456481:448:20)
    at $calc (http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705105456481:630:10)
    at http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705105456481:1112:33
    at ExecutionContextVariable.invokeWith (http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705105456481:765:14)
    at Context.invokeWith (http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705105456481:813:25)
    at Suspense (http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705105456481:1095:26)
    at createComponentInstance (http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705105456481:1382:15)
    at http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705105456481:1560:18
    at callAndInvokeListenerForEachDependency (http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705105456481:152:12)
*/
const chromeRegex =
    /^\s*at (?:(?<func>(?:new )?[^(]+) \((?<location>[^)]+):([0-9]+):([0-9]+)\)\s*|(?<location_alt>[^)]+):(?<row>[0-9]+):(?<col>[0-9]+)\)\s*)$/gim;

/*
Example:
getNiceStackTrace@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-utilities/build/index.js?t=1705104034061:141:17
 */
const firefoxRegex =
    /^(?<func>[^@]+)@(?<location>[^@]+@[^@]+):(?<row>[0-9]+):(?<col>[0-9]+)$/gim;

function normalizeFunctionName(name: string | undefined) {
    if (!name) {
        return '';
    }

    if (name.startsWith('#')) {
        name = name.substring(1);
    }

    if (name.endsWith('_fn')) {
        name = name.substring(0, name.length - '_fn'.length);
    }

    return name;
}

export function getNiceStackTrace(ignore: string[]): () => string {
    const ignoreNormalized = new Set(ignore.map(normalizeFunctionName));

    return () => {
        const error = new Error();
        if (!error.stack) {
            return '<no stack trace found>';
        }

        const chromey = error.stack.startsWith('Error') ?? false;

        const regex = chromey ? chromeRegex : firefoxRegex;

        const parts: (string | undefined)[] = [];

        for (const match of error.stack.matchAll(regex)) {
            if (!match.groups) continue;

            const func = normalizeFunctionName(match.groups['func']);
            const location =
                match.groups['location'] ?? match.groups['location_alt'];
            const row = match.groups['row'];
            const col = match.groups['col'];

            if (func === 'getNiceStackTrace' || ignoreNormalized.has(func)) {
                continue;
            }

            parts.push(func);
            parts.push(' ');
            parts.push(location);
            parts.push(' (row: ');
            parts.push(row);
            parts.push(' col: ');
            parts.push(col);
            parts.push(')');
        }

        return parts.join('');
    };
}
