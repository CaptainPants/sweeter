import { StackTrace } from './StackTrace';

it('StackTrace returns a consistent result', () => {
    function test2() {
        return new StackTrace();
    }

    function test1() {
        return test2();
    }

    const trace = test1();

    expect(trace.getNice({ truncate: 3 })).toMatchSnapshot();
});
