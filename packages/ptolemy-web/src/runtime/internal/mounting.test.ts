import { createLogger } from '@serpentis/ptolemy-utilities';

import {
    addMountedCallback,
    addUnMountedCallback,
    announceMountedRecursive,
    announceUnMountedRecursive,
} from './mounting.js';

const logger = createLogger('mounting.test.js', 'dummy');

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

    announceMountedRecursive(logger, obj);

    expect(fired).toStrictEqual(true);
});

it('Un-mount callbacks fired', () => {
    const obj = document.createComment('Mounted');

    let fired = false;

    const callback = () => {
        fired = true;
    };

    // We have to make sure the mounted flag is set
    announceMountedRecursive(logger, obj);

    addUnMountedCallback(
        () => {
            throw new Error('Not implemented');
        },
        obj,
        callback,
    );

    announceUnMountedRecursive(logger, obj);

    expect(fired).toStrictEqual(true);
});
