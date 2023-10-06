import { Async, Suspense } from "@captainpants/wireyui-core";
import { testRender } from "../renderer/testRender.js";

it('Fallback is shown', () => {
    function neverFinishes(signal: AbortSignal) {
        return new Promise<number>(
            (resolve, reject) => {
                signal.addEventListener('abort', () => reject(signal.reason));
            }
        )
    }

    const res = testRender(
        () => <Suspense fallback={() => <div>FALLBACK</div>}>{
            () => <Async<number> callback={neverFinishes}>{
                result => {
                    return result;
                }    
            }</Async>
        }</Suspense>
    );

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
})