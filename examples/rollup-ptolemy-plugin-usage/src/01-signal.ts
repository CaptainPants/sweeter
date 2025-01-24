import {
    $controller,
    $deferred,
    $derived,
    $mutable,
    SignalState,
} from '@serpentis/ptolemy-core';

export function signalExample() {
    const signal = $mutable(1);
    const derived = $derived(() => signal.value + 2);
    const deferred1 = $deferred(derived);
    const deferred2 = $deferred(deferred1);
    void $controller(SignalState.success(1)).signal;

    const dontIdentify = $mutable(2).doNotIdentify();
    ignore(dontIdentify);

    function unused() {
        deferred2.peek();
    }

    ignore(unused);
}

function ignore(subj: unknown) {
    console.log('Cannot ignore', subj);
}
