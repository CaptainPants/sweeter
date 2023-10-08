import { addMounted, addUnMounted, mounted, unMounted } from './mounting.js';

it('Mount callbacks fired', () => {
    const obj = document.createComment('Mounted');

    let fired = false;

    const callback = () => {
        fired = true;
    };

    addMounted(obj, callback);

    mounted(obj);

    expect(fired).toStrictEqual(true);
});

it('Un-mount callbacks fired', () => {
    const obj = document.createComment('Mounted');

    let fired = false;

    const callback = () => {
        fired = true;
    };

    addUnMounted(obj, callback);

    unMounted(obj);

    expect(fired).toStrictEqual(true);
});
