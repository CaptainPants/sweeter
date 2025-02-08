
<img src="assets/ptolemy-with-text.png" alt="Ptolemy" title="Ptolemy" />

## What is Ptolemy?
This is an experimental UI project built on principles borrowed from React, SolidJS, Vue and Angular.

Some key focus areas that make it unique:
1. We explicitly do not support outdated browsers. Our minimum requirement is support for WeakRef and FinalisationRegistry.
2. We do not like compiler magic. You should be able to use Ptolemy without plugins on top of TypeScript. We may offer improvements to performance or debugging via plugins to e.g. Vite.
3. Have few dependencies.
4. You should reasonably be able to implement a full SPA application without any additional 3rd party libraries.
5. Debugging tools are (will be) included.
6. We plan to contribute back knowledge to the community (E.g. some poorly documented magic on JSX like JSX.LibraryManagedAttributes)
7. You should be able to extend the framework.

See [here](docs/index.md) for more documentation.

An example component that shows a few assorted functions:
```tsx
export interface ExampleProps {
    // In the type ExampleProps this will be `url: string | Signal<string>`
    url: string;
}>;

// Compare to React - a Component is a function that runs only once
const Example: Component<ExampleProps> = ({ url }, init) => {
    // These are basic mutable signals (type: ReadWriteSignal<T>)
    const textValue   = $mutable('initial value');
    const serverValue = $mutable<unknown>(null);

    // You can also have a calculated signal
    const textValueWithSuffix = $derived(() => textValue.value + ' + suffix');

    // AsyncRunnerHook does 2 things: 1) it provides a Signal<boolean> asyncRunner.running to make 
    // visible when the runner is currently executing a callback, and 2) optionally cancel an 
    // execution in progress by aborting the AbortSignal provided as the first argument to the 
    // callback passed in asyncRunner.run
    const asyncRunner = init.hook(AsyncRunnerHook);

    // Generate a sequential id, optionally with a 'basis'
    const id = init.idGenerator.next('textValue');

    init.onMount(() => {
        // When component is added
        example.value = 'updated on mount';

        return () => {
            // Runs on unmount
        };
    });

    // The AbortSignal parameter is provided by the AsyncRunnerHook to allow it to cancel execution
    // in progress.
    const asyncAction = async (signal: AbortSignal): Promise<void> => {
        // .peek() reads a signal/constant without subscribing to changes, useful 
        // when reading the current state of a signal within a callback
        const data = await fetch(url.peek(), { signal: abort });

        // Assign value to the signal
        serverValue.value = data;
    }
    

    // JSX intrinsic elements directly call document.createElement, so the result 
    // can be manipulated like any other DOM elements. 
    // There is one gotcha: JSX.Element is a union type of all possible JSX results
    // so you will need to assert the value to its correct type in order to use it
    // in a meaningful way.
    const div = <div />;

    // Note the bind:value is a 2-way binding of a mutable signal to a compatible
    // property. Out of the box this only works for the value properties of form
    // elements (bind:value and bind:checked).
    return <>
        <label for={id}>This is a field:</label>
        <input 
            id={id} 
            type="text" 
            bind:value={textValue} />
        <br />
        Current value: {textValue}<br />
        Added a suffix {textValueWithSuffix}<br />
        Or inline {$derived(() => textValue.value + ' + suffix')}<br />
        <br />
        <button 
            disabled={asyncRunner.running} 
            onClick={() => asyncRunner.run(asyncAction)}>Load</button>
    </>
};
```

A few things you might note:
1. Sigil ($) prefixed functions are special Ptolemy building blocks.
2. The init parameter that gives access to what in other frameworks are called 'hooks' - these are methods that only work during initial wireup that give access to attaching lifecycle methods.
3. init.hook is used to instantiate 'hooks' - which are components that have access to the component lifecycle to provide some functionality. They may also create their own hook instances.
4. Components can be mounted, unmounted and remounted - make sure to take that into account when authoring your components. Suspense will mount the component in its incomplete state 'offscreen'.
