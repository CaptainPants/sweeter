import {
    addMountedCallback,
    addUnMountedCallback,
    announceMountedRecursive,
    announceUnMountedRecursive,
} from './mounting.js';

it('Mount callbacks fired', () => {
    const obj = document.createComment('Mounted');

    let fired = false;

    const callback = () => {
        fired = true;
    };

    addMountedCallback(
        () => {
            throw new Error('Not implemented');
        },
        obj,
        callback,
    );

    announceMountedRecursive(obj);

    expect(fired).toStrictEqual(true);
});

it('Un-mount callbacks fired', () => {
    const obj = document.createComment('Mounted');

    let fired = false;

    const callback = () => {
        fired = true;
    };

    // We have to make sure the mounted flag is set
    announceMountedRecursive(obj);

    addUnMountedCallback(
        () => {
            throw new Error('Not implemented');
        },
        obj,
        callback,
    );

    announceUnMountedRecursive(obj);

    expect(fired).toStrictEqual(true);
});
