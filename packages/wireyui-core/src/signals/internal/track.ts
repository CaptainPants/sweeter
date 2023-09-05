import { Signal } from "../Signal.js";
import { listen } from "../ambient.js";

export function track(callback: () => void) {
    const listener = (signal: Signal<unknown>) => {
        console.log('thing');
    }

    {
        using _ = listen(listener);
        
        callback();
    }
}