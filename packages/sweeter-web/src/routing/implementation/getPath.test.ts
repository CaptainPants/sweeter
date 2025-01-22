import { URL } from "url"

import { getPath } from "./getPath.js"

test('getPath gives sensible results', () => {
    expect(getPath(new URL('http://google.com/test'), 'test')).toStrictEqual('');

    expect(getPath(new URL('http://google.com/test/cheese'), 'test')).toStrictEqual('cheese');

    expect(getPath(new URL('http://google.com/test/cheese'), 'wrongpath')).toStrictEqual(null);

    expect(getPath(new URL('http://google.com/'), '')).toStrictEqual('');
    
    expect(getPath(new URL('http://google.com/cheese'), '')).toStrictEqual('cheese');
})