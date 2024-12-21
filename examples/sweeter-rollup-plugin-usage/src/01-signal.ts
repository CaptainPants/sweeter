import {
    $controller,
    $defer,
    $derive,
    $mutable,
    SignalState,
} from '@captainpants/sweeter-core';

export function signalExample() {
    const signal = $mutable(1);
    const derived = $derive(() => signal.value + 2);
    const deferred1 = $defer(derived);
    const deferred2 = $defer(deferred1);
    $controller(SignalState.success(1)).signal;
    
    const dontIdentify = $mutable(2).doNotIdentify();

    function unused() {
        deferred2.peek();
    }

    ignore(unused);
}

function ignore(subj: Function) {
    console.log('Cannot ignore this function', subj.name);
}

function test() {
    function test2() {}
}
