import { createLocationSignal } from "./createLocationSignal";

test('Test', () => {
    let location = "/start";
    createLocationSignal.getLocation = () => {
        return location;
    }
    function setLocation(newLocation: string) {
        location = newLocation;
        window.dispatchEvent(new Event('popstate', {}));
    }

    const handle = createLocationSignal();
    try {
        const urls: string[] = [];

        handle.signal.listen(
            () => {
                urls.push(handle.signal.peek());
            }
        );
        
        expect(handle.signal.peek()).toEqual('/start');
        expect(urls).toEqual([]);

        setLocation('/test1');

        expect(handle.signal.peek()).toEqual('/test1');
        expect(urls).toEqual(['/test1']);

        setLocation('/test2');

        expect(handle.signal.peek()).toEqual('/test2');
        expect(urls).toEqual(['/test1', '/test2']);
    }
    finally {
        handle.dispose();
    }
});