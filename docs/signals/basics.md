# Signals
There are three basic types of signals:
- Readable signals: `Signal<T>`
- Writable signals: `WritableSignal<T>`
- The combination of both is `ReadWriteSignal<T>`

The most common signal factory functions are:
## $mutable
This creates a basic `ReadWriteSignal<T>` instance.

Example:
```tsx
import { $mutable } from '@captainpants/sweeter-core';

const mutable = $mutable<string | null>(null);

mutable.value = 'example';
// Or the slightly less nice update function
mutable.update('example');
```

## $calc
This creates a `Signal<T>` that is derived from others via a derivation function.

Example:
```tsx
import { $mutable, $calc } from '@captainpants/sweeter-core';

const a = $mutable(1);
const b = $mutable(2);

const c = $calc(() => a.value + b.value);

a.value = 3; // This will trigger any subscribers to c to be updated with the new value of 5
```

## $propertyOf
This creates a new signal based on accessing a property of the current value of an existing signal. If the signal is writable, updates to the created signal will propagate back to the original.

```tsx
import { $mutable, $propertyOf } from '@captainpants/sweeter-core';

const root = $mutable({
    test: 1
});

const property = $propertyOf(root, 'test');

property.value = 2; // This will be reflected back to the original 'root' signal
```


## $elementOf
This creates a new signal based on accessing an element of the current value of an existing signal. If the signal is writable, updates to the created signal will propagate back to the original.

```tsx
import { $mutable, $elementOf } from '@captainpants/sweeter-core';

const root = $mutable([1, 2, 3]);

const property = elementOf(root, 1);

property.value = -2; // This will be reflected back to the original 'root' signal, updating its value to [1, -2, 3]
```

## $readonly
This creates a readonly signal from a `ReadWriteSignal<T>`.

Example:
```tsx
import { $mutable, $readonly } from '@captainpants/sweeter-core';

const mutable  = $mutable(1);

const readonly = $readonly(mutable);
```
This is basically an alias for `$calc(() => mutable.value)` to make your intention clearer.

## $constant
This creates a readonly signal whose value never changes.

Example:
```tsx
import { $constant } from '@captainpants/sweeter-core';

const constant = $constant(1);
```

## $controlled
This creates a signal that is readonly, but can be updated by the holder of a reference to its 'controller'.

Example:
```tsx
import { SignalController, $controlled } from '@captainpants/sweeter-core';

const controller = new SignalController<number>();

const signal = $controlled(controller);

controller.update({ mode: 'SUCCESS', value: 1 })
```

## $deferred
This creates a readonly alias to a signal that is updated asynchronously (the default mechanism being queueMicrotask).

```tsx
import { $mutable, $deferred } from '@captainpants/sweeter-core';

const mutable  = $mutable(1);
const deferred = $deferred(mutable);

mutable.value = 2;
// The deferred signal will not update until queued microtasks are executed, so at this point
console.log(deferred.peek()); // will output 1
```

This may be removed as its not that useful.

## $mutableFromCallbacks
This is a lot like `$calc`, but is a `ReadWriteSignal<T>`. Writes to this signal will call a callback function.

Example:
```tsx
import { $mutable, $mutableFromCallbacks } from '@captainpants/sweeter-core';

const a = $mutable(1);
const b = $mutable(2);

const mutable = $mutableFromCallbacks(
    () => a.value + b.value, 
    newValue => {
        a.value = newValue - b.peek();
    }
);

mutable.value = 5; // updates a.value = 2 - 5, so mutable.value ==
```