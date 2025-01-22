import { StackTrace } from './StackTrace.js';

it('StackTrace returns a consistent result', () => {
    function test2() {
        return new StackTrace();
    }

    function test1() {
        return test2();
    }

    const trace = test1();

    const nice = trace.getNice({ truncate: 3 });

    const pathRemoved = nice.replaceAll(process.cwd(), '<< PATH >>').replaceAll('\\', '/');

    expect(pathRemoved).toMatchSnapshot();
});
