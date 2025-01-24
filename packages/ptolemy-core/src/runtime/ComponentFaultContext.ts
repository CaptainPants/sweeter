import { Context } from '../context/index.js';

export const ComponentFaultContext = new Context('ComponentFaultContext', {
    /**
     * Causes the children signal whose ComponentFaultContext we belong to to fault, throwing the provided error value
     * @param err
     */
    reportFaulted(err: unknown): void {
        const asError = err as Error;
        const message = asError.message ? asError.message : String(asError);
        throw new Error('Fault error escaped to top level ' + message);
    },
});
