# Signals
There are three basic types of signals:
- Readable signals: `Signal<T>`
- Writable signals: `WritableSignal<T>` (you are unlikely to use this by itself)
- The combination of both is `ReadWriteSignal<T>`

## The Interfaces
These are the most important interfaces relating to signals usage.

This is the callback signature for listening for signal updates.
```tsx
/**
 * Signature for signal listeners that are manually registered.
 */
export type SignalListener<T> = (
    next: SignalState<T>,
    previous: SignalState<T>,
    trigger: Signal<unknown> | undefined
) => void;
```

A normal readable signal:
```tsx
export interface Signal<T> {
    /**
     * Get the current value of the signal and subscribe for updates. If the result of the signal
     * is an exception, it is rethrown.
     */
    readonly value: T;

    /**
     * Get the current value of the signal without subscribing for updates. If the result of the signal
     * is an exception, it is rethrown.
     */
    peek(): T;

    /**
     * Gets the current state of the signal, which might be an exception.
     */
    peekState(ensureInited?: boolean = true): SignalState<T>;

    /**
     * Use this to check if a signal has been initialized. This can be useful in a $derived that references itself.
     */
    readonly inited: boolean;
    /**
     * Use this to check if the signal is currently in a failed state, which means .peek()/.value would throw if called.
     */
    readonly failed: boolean;

    /**
     * Add a callback to be invoked when the signal's value changes. 
     * @param listener
     */
    listen(listener: SignalListener<T>): () => void;

    /**
     * Add a callback to be invoked when the signal's value changes. The reference to listener is held via WeakRef.
     * @param listener
     */
    listenWeak(listener: SignalListener<T>): () => void;

    /**
     * Remove a callback that has previously been registered.
     * @param listener
     */
    unlisten(listener: SignalListener<T>): void;

    /**
     * Remove a callback that has previously been registered.
     * @param listener
     */
    unlistenWeak(listener: SignalListener<T>): void;

    /**
     * Remove all listeners.
     */
    clearListeners(): void;

    // == DEBUGGING ==

    /**
     * Globally unique id of signal, used only for debugging.
     */
    readonly debugId: number;

    /**
     * If enabled, this will contain a stack trace created in the constructor of the signature, allowing
     * you to work out where the signal was created.
     */
    readonly createdAtStack?: StackTrace;

    /**
     * Associate location information with the signal for debugging. This is readable via this.getDebugIdentity()
     * @param name 
     * @param sourceFile 
     * @param sourceMethod 
     * @param row 
     * @param col 
     */
    identify(
        name: string,
        sourceFile?: string,
        sourceMethod?: string,
        row?: number,
        col?: number,
    ): this;

    /**
     * Marks that this signal should not be annotated with information about where it was created. This is used by the rollup plugin.
     */
    doNotIdentify(): this;

    /**
     * Retrieve declaration information about the signal if present. 
     */
    getDebugIdentity(): string;

    /**
     * Retrieve information about listeners that are currently registered.
     */
    getDebugListenerInfo(): DebugListenerInfo;

    /**
     * Gets a JSON tree of dependents of the current signal.
     */
    debugGetListenerTree(): DebugDependencyNode;
}
```

A signal that is both readable and writable:
```tsx
export interface ReadWriteSignal<T> extends Signal<T>, WritableSignal<T> {
    // This interface combines Signal<T> and WritableSignal<T>
}
```

## Factory functions
The most common signal factory functions are introduced in this section.
### $mutable
This creates a basic `ReadWriteSignal<T>` instance.

Example:
```tsx
import { $mutable } from '@serpentis/ptolemy-core';

const mutable = $mutable<string | null>(null);

mutable.value = 'example';
```

### $derived
This creates a `Signal<T>` that is derived from others via a derivation function.

Example:
```tsx
import { $mutable, $derived } from '@serpentis/ptolemy-core';

const a = $mutable(1);
const b = $mutable(2);

const c = $derived(() => a.value + b.value);

a.value = 3; // This will trigger any subscribers to c to be updated with the new value of 5
```

### $derived (with updates)
This is a lot like `$derived`, but is a `ReadWriteSignal<T>`. Writes to this signal will call a callback function.

Example:
```tsx
import { $derived, $mutable } from '@serpentis/ptolemy-core';

const a = $mutable(1);
const b = $mutable(2);

const mutable = $derived(
    () => a.value + b.value, 
    newValue => {
        a.value = newValue - b.peek();
    }
);

mutable.value = 5; // updates a.value = 5 - 2, so mutable.value == 2
```

### $propertyOf
This creates a new signal based on accessing a property of the current value of an existing signal. If the signal is writable, updates to the created signal will propagate back to the original.

```tsx
import { $mutable, $propertyOf } from '@serpentis/ptolemy-core';

const root = $mutable({
    test: 1
});

const property = $propertyOf(root, 'test');

property.value = 2; // This will be reflected back to the original 'root' signal
```


### $elementOf
This creates a new signal based on accessing an element of the current value of an existing signal. If the signal is writable, updates to the created signal will propagate back to the original.

```tsx
import { $mutable, $elementOf } from '@serpentis/ptolemy-core';

const root = $mutable([1, 2, 3]);

const property = $elementOf(root, 1);

property.value = -2; // This will be reflected back to the original 'root' signal, updating its value to [1, -2, 3]
```

### $readonly
This creates a readonly signal from a `ReadWriteSignal<T>`.

Example:
```tsx
import { $mutable, $readonly } from '@serpentis/ptolemy-core';

const mutable  = $mutable(1);

const readonly = $readonly(mutable);
```
This is basically an alias for `$derived(() => mutable.value)` to make your intention clearer.

### $constant
This creates a readonly signal whose value never changes.

Example:
```tsx
import { $constant } from '@serpentis/ptolemy-core';

const constant = $constant(1);
```

This signal is unique in that it doesn't announce itself for change tracking - as this is not necessary because the value
is never allowed to change.

### $controlled
This creates a signal that is readonly, but can be updated by the holder of a reference to its 'controller'.

Example:
```tsx
import { $controller } from '@serpentis/ptolemy-core';

const controller1 = $controller<number>(); // Starts in the INITIALISING state
const controller2 = $controller<number>(SignalState.success(1)); // Starts with a value

const signal2 = controller2.signal;

controller.update(SignalState.success(2)); // Triggers updates to anything subscrived to signal2
```

### $deferred
This creates a readonly alias to a signal that is updated asynchronously (the default mechanism being queueMicrotask).

```tsx
import { $mutable, $deferred } from '@serpentis/ptolemy-core';

const mutable  = $mutable(1);
const deferred = $deferred(mutable);

mutable.value = 2;
// The deferred signal will not update until queued microtasks are executed, so at this point
console.log(deferred.peek()); // will output 1
```

This may be removed as its not that useful.

### $filtered
This is used to memoize values according to an equality function.

```tsx
import { $deferred, $filtered } from '@serpentis/ptolemy-core';

const array    = $derived(() => /* some calculation */);
const filtered = $filtered(array, equals.deep); // If the result of array has an identical structure (but not necessarily referential equality), then filtered will keep its previous result.