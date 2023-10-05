import { Suspense } from "@captainpants/wireyui-core"
import { testRender } from "../renderer/testRender.js";

it('Suspense displays children', () => {
    const res = testRender(
        () => <Suspense fallback={() => <div>FALLBACK</div>}>{
            () => <div>COMPLETE</div>
        }</Suspense>
    );

    expect(res.getHTML()).toMatchSnapshot();
})