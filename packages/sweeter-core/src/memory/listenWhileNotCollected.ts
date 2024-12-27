import {
    addExplicitStrongReference,
    whenGarbageCollected,
} from '@captainpants/sweeter-utilities';
import { Signal, SignalState } from '../signals';

/**
 * Utility function for correctly setting up a state listener callback on a signal that is limited to the lifetime
 * of the associated element. As this is garbage collector voodoo, there are no guarantees it will ever be cleaned
 * up, but it _should_ allow it to be.
 * @param callback Callback to register with the signal. This is explictly allowed to have a strong reference to the
 * lifetimeElement.
 */
export function listenWhileNotCollected<TElement extends object, T>(
    lifetimeElement: TElement,
    signal: Signal<T>,
    callback: (state: SignalState<T>) => void,
) {
    // Need to keep alive signal and onChange as long as lifetimeElement
    // stays alive. When parentNode is garbage collected we no longer care
    // and can also unregister listener on the signal.
    addExplicitStrongReference(lifetimeElement, signal); // Keep the signal alive
    addExplicitStrongReference(lifetimeElement, callback);
    // callback (maybe) holds a strong reference to lifetimeElement, so we can't allow
    // a strong reference from flattenedChildrenSignal to it..
    const unlisten = signal.listenWeak(callback);
    whenGarbageCollected(lifetimeElement, unlisten); // This line is optional, as the listener is associated via weakref that will be cleaned up on next invokation

    // So in terms of references:
    // - signal            => weak            => callback (and therefore PROBABLY lifetimeElement)
    // - callback PROBABLY => strong          => lifetimeElement (and therefore signal)
    // - lifetimeElement   => EXPLICIT strong => lifetimeElement, callback
    // So the only weak link is from signal out. Therefore if callback and lifetimeElement become unreachable
    // and are garbage collected, then they will stop listening to the signal.
}
