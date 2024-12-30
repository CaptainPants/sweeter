import { whenGarbageCollected } from "./whenGarbageCollected";

it('First attempt at garbage collection aware unit test', () => {
    let collected = false;

    let thing: object | undefined = {};

    whenGarbageCollected(thing, () => {
        collected = true;
    });

    eval("%CollectGarbage('all')");

    expect(collected).toStrictEqual(false);

    thing = undefined;

    eval("%CollectGarbage('all')");

    expect(collected).toStrictEqual(true);
});