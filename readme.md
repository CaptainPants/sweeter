
# Sweeter
This is an experimental UI project built on principles learnt from React and SolidJS.

A simple example component:
```jsx
const Example: Component = (_, init) => {
    const example = $mutable('');

    const asyncRunner = init.hook(AsyncRunnerHook);

    const id = init.idGenerator.next();

    init.onMount(() => {
        example.value = 'test';

        return () => {
            // Runs on unmount
        };
    });

    const load = async (): Promise<void> => {
        const data = await fetch('http://localhost/test/json');
    }

    return <>
        <label for={id}>This is a field:</abel>
        <input 
            id={id} 
            type="text" 
            bind:value={value} 
            title={$calc(() => 'This is a title: ' + example.value)} />
        <br />
        <button 
            disabled={asyncRunner.running} 
            onClick={() => asyncRunner.run(load)}>Load</button>
    </>
};
```

A few things you might note:
1. Sigil ($) prefixed functions are special Sweeter building blocks.
2. The init parameter that gives access to what in other frameworks are called 'hooks' - these are methods that only work during initial wireup that give access to attaching lifecycle methods.
3. init.hook is used to instantiate 'hooks' - which are components that have access to the component lifecycle to provide some functionality. They may also create their own hook instances.

# Why not use X
As with many projects, the main answer is: because I felt like giving it a go.

## React
React has proven some powerful UI paradigms, and is an amazing framework.

Positives:
1. Well established
2. Proved a nice easy to use, reasonably performant, declarative paradigm to modern reactive web UI
3. Huge community
4. Lots of job opportunity

Challenges:
1. Slow improvement release cadence (18 months since last release as of Jan 2024)
2. Enhancement focus on SSR and technologies more suited to server side Node / NextJS
3. Pushing core functionality (Suspence data loading) to 3rd party components
4. Performance issues in some spaces

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