
# Sweeter
This is an experimental UI project built on principles learnt from React and SolidJS.

See [here](docs/index.md) for more documentation.

An example component that shows a few assorted functions:
```tsx
// MightBeSignals<T> enables all the properties in the provided type to either be a constant OR a signal
// we then use $val or $peek to access those values within the component.
export type ExampleProps = MightBeSignals<{
    // In the type ExampleProps this will be `url: string | Signal<string>`
    url: string;
}>;

const Example: Component<ExampleProps> = ({ url }, init) => {
    // These are basic mutable signals (type: ReadWriteSignal<T>)
    const textValue   = $mutable('initial value');
    const serverValue = $mutable<unknown>(null);

    // You can also have a calculated signal
    const textValueWithSuffix = $calc(() => textValue.value + ' + suffix');

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
        // $peek reads a signal/constant without subscribing to changes, useful 
        // when reading the current state of a signal within a callback
        const data = await fetch($peek(url), { signal: abort });

        // Assign value to the signal
        serverValue.value = data;
        // OR
        serverValue.update(data);
        // The .value version is nicer but isn't part of the ReadWriteSignal interface due to some 
        // challenges in the type-system
    }

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
        Or inline {$calc(() => textValue.value + ' + suffix')}<br />
        <br />
        <button 
            disabled={asyncRunner.running} 
            onClick={() => asyncRunner.run(asyncAction)}>Load</button>
    </>
};
```

A few things you might note:
1. Sigil ($) prefixed functions are special Sweeter building blocks.
2. The init parameter that gives access to what in other frameworks are called 'hooks' - these are methods that only work during initial wireup that give access to attaching lifecycle methods.
3. init.hook is used to instantiate 'hooks' - which are components that have access to the component lifecycle to provide some functionality. They may also create their own hook instances.
4. Components can be mounted, unmounted and remounted - make sure to take that into account when authoring your components. Suspense will mount the component in its incomplete state 'offscreen'.

# Why not use X
As with many projects, the main answer is: because I felt like giving it a go.

## React
React has proven some powerful UI paradigms, and is an amazing framework.

Positives:
1. Well established
2. Proved a nice easy to use, reasonably performant, declarative paradigm to modern reactive web UI
3. Huge community
4. Lots of job opportunity
5. Hooks are a very interesting approach to bundling reusable functionality

Challenges:
1. Slow improvement release cadence (18 months since last release as of Jan 2024)
2. Enhancement focus on SSR and technologies more suited to server side Node / NextJS
3. Pushing core functionality (Suspence data loading) to 3rd party components
4. Performance issues in some spaces
5. Hooks break the React rule of sticking to idiomatic JavaScript

## Solid JS
Solid JS is a very good proof of concept.

A couple of things that I don't love about SolidJS
1. Limited out of the box functionality with a limited but growing community
2. I don't love having an additional preprocessor and magic to 'hide' calculated signals created during component creation

# Principles:
1. Limit dependencies as much as possible
2. Include everything you need for a basic SPA application
3. Do not do 'magic' - everything should be (reasonably) idiomatic typescript with JSX, and therefore be relatively easy to understand for newcomers
4. Do not target 'old' browsers: we will not support IE11, or out of date mobile browsers
5. Include debugging tools
6. Be open and extensible
7. Contribute lessons learned back to the community - E.g. how typescript JSX works documentation is a bit garbage and we can help improve that

## Modern technology
Sweeter relies on WeakRef which is only supported in quite recent browsers. The hope is that this becomes less of a limitation over time. For my personal usage I intend to use Sweeter in desktop applications inside WebView2 and similar components where this is less of an issue.