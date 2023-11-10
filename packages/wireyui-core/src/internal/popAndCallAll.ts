export function popAndCallAll(list: (() => void)[]) {
    for (let item = list.pop(); item; item = list.pop()) {
        item();
    }
}
