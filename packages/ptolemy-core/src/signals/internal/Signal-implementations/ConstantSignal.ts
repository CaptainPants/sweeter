import { SignalState } from "../../SignalState.js";
import { DebugListenerInfo, SignalListener } from "../../types.js";

import { SignalBase } from "./SignalBase.js";

/**
 * Optimised implementation of Signal for wrapping a constant.
 */
export class ConstantSignal<T> extends SignalBase<T> {
    #value: T;

    #stateCache?: SignalState<T>;

    constructor(value: T) {
        super();
        this.#value = value;
    }

    get value(): T {
        return this.#value;
    }

    get inited(): boolean { return true; }
    get failed(): boolean { return false; }
    
    public override peek(): T {
        throw new Error("Method not implemented.");
    }
    public override peekState(_ensureInit?: boolean): SignalState<T> {
        if (!this.#stateCache) {
            this.#stateCache = Object.freeze({
                mode: 'SUCCESS', 
                value: this.#value
            });
        }
        
        return this.#stateCache;
    }

    public override listen(_listener: SignalListener<T>): () => void {
        return nothing;
    }

    public override listenWeak(_listener: SignalListener<T>): () => void {
        return nothing;
    }

    public override unlisten(_listener: SignalListener<T>): void {
    }

    public override unlistenWeak(_listener: SignalListener<T>): void {
    }

    public override clearListeners(): void {
    }

    public override getDebugListenerInfo(): DebugListenerInfo {
        return {
            liveCount: 0,
            getDetail: () => "== NO LISTENERS THIS SIGNAL IS A CONSTANT =="
        };
    }

}

function nothing () {

}