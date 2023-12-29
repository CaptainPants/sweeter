import { hasOwnProperty } from "./hasOwnProperty.js";

it('General', () => {
    const obj: Record<string, unknown> = {};
    
    expect(hasOwnProperty(obj, 'test')).toStrictEqual(false);

    obj['test'] = true;

    expect(hasOwnProperty(obj, 'test')).toStrictEqual(true);

    delete obj['test'];

    expect(hasOwnProperty(obj, 'test')).toStrictEqual(false);

    const proto = { 
        'test': true
    };

    Object.setPrototypeOf(obj, proto);

    expect(obj['test']).toStrictEqual(true);

    expect(hasOwnProperty(obj, 'test')).toStrictEqual(false);
});