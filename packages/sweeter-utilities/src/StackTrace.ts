/*
Example:
Error
    at getNiceStackTrace (http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-utilities/build/index.js?t=1705104034061:141:17)
    at new DerivedSignal (http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705105456481:448:20)
    at $derive (http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705105456481:630:10)
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
getNiceStackTrace/<@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-utilities/build/index.js:146:19
SignalBase@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:256:29
DerivedSignal@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:454:5
$derive@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:674:10
createCssClassSignal@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:1174:10
bindDOMClassProp@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:1212:43
createDOMElement@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:1290:21
endJsx_fn/result<@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:1563:43
callAndInvokeListenerForEachDependency@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:151:12
trackingIsAnError@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:116:10
endJsx_fn@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:1556:35
createMiddlewarePipeline/<@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:1348:12
jsx@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:1496:51
jsx@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/jsx-dev-runtime-j4xFHegK.js?t=1705145534111:12:21
RigidObjectEditor/</<.children<.children<.children<@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-typeytypetype-web/build/index.js?t=1705145534111:801:76
RigidObjectEditor/<@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-typeytypetype-web/build/index.js?t=1705145534111:794:107
result@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:438:23
callAndInvokeListenerForEachDependency@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:151:12
callAndReturnDependencies@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:138:56
recalculate_fn@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:532:83
derivedSignalListener@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:483:59
announce@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:212:19
SignalBase_announceChange@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:335:40
finishCalculation@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:84:9
recalculate_fn@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:545:5
derivedSignalListener@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:483:59
announce@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:212:19
SignalBase_announceChange@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:335:40
afterCalculationsComplete@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:101:5
announceChange_fn@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:344:28
_updateAndAnnounce@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:285:63
set value@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:657:11
update@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:660:5
updatePropertyValue@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-typeytypetype-web/build/index.js?t=1705145534111:739:11
async*replace@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-typeytypetype-web/build/index.js?t=1705145534111:575:29
onValid@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-typeytypetype-web/build/index.js?t=1705145534111:895:29
update_fn@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-typeytypetype-web/build/index.js?t=1705145534111:681:63
async*DraftHook/</<@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-typeytypetype-web/build/index.js?t=1705145534111:650:51
run@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:1206:30
DraftHook/<@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-typeytypetype-web/build/index.js?t=1705145534111:649:19
innerCallback@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:768:19
subscribeToChanges@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:782:5
subscribeChanges_onMount@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:1354:18
callAgainstComponentFaultContext@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:44:12
inner@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:102:45
execute@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:83:13
announceMountedRecursive@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:127:22
announceChildrenMountedRecursive@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:121:29
announceMountedRecursive@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:126:37
announceChildrenMountedRecursive@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:121:29
announceMountedRecursive@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:126:37
announceChildrenMountedRecursive@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:121:29
announceMountedRecursive@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:126:37
announceChildrenMountedRecursive@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:121:29
announceMountedRecursive@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:126:37
announceChildrenMountedRecursive@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:121:29
announceMountedRecursive@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:126:37
onChange@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-web/build/index.js?t=1705145534111:197:33
announce@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:212:19
SignalBase_announceChange@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:335:40
finishCalculation@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:84:9
recalculate_fn@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:545:5
derivedSignalListener@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:483:59
announce@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:212:19
SignalBase_announceChange@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:335:40
finishCalculation@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:84:9
recalculate_fn@http://localhost:5173/@fs/K:/Workspaces/sweeter/packages/sweeter-core/build/index.js?t=1705145534111:545:5
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

export function getRawStackTrace(): string {
    return new Error().stack ?? '<no stack trace found>';
}

const defaults = {};

export interface StackTraceOptions {
    /**
     * How many stack frames to skip off the top, useful to exclude irrelevant frames like e.g. a utility function that actually creates the StackTrace, or a base class constructor.
     */
    skipFrames?: number;
    context?: string;
}

export interface NiceFormatOptions {
    truncate?: number | undefined;
    padding?: string | undefined;
}

const defaultOptions = {};

export class StackTrace {
    constructor({ skipFrames, context }: StackTraceOptions = defaults) {
        this.skipFrames = skipFrames ?? 0;
        this.context = context;

        this.#error = new Error();
    }

    #error: Error;

    readonly skipFrames: number;
    readonly context?: string | undefined;
    readonly previous?: StackTrace | undefined;

    getNice({ padding, truncate }: NiceFormatOptions = defaultOptions) {
        padding ??= '';

        const raw = this.#error.stack;
        if (!raw) {
            return (
                (this.context ? this.context + '\n' : '') +
                '<no stack trace found>'
            );
        }

        const chromey = raw.startsWith('Error') ?? false;

        const regex = chromey ? chromeRegex : firefoxRegex;

        const rows: string[] = [];

        if (this.context) {
            rows.push(this.context);
        }

        const matches = [...raw.matchAll(regex)].slice(1 + this.skipFrames);
        let counter = 0;
        for (const match of matches) {
            if (!match.groups) continue;

            if (truncate !== undefined && counter > truncate) {
                break;
            }

            const func = normalizeFunctionName(match.groups['func']);
            const location =
                match.groups['location'] ?? match.groups['location_alt'];
            const row = match.groups['row'];
            const col = match.groups['col'];

            rows.push(
                `${padding}${func} ${location} (row: ${row} col: ${col})`,
            );

            ++counter;
        }

        return rows.join('\n');
    }

    get raw(): string | undefined {
        return this.#error.stack ?? '<no stack trace found>';
    }
}
