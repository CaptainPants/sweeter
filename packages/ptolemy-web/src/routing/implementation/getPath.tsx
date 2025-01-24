/**
 *
 * @param url
 * @param basePath
 * @returns
 */
export function getPath(url: URL, basePath: string): string | null {
    let path = url.pathname;
    if (path.startsWith('/')) {
        // I think it always will, but whatever
        path = path.substring(1);
    }

    if (path === basePath) {
        return '';
    }

    if (basePath === '') {
        return path;
    }

    if (path.startsWith(basePath + '/')) {
        return path.substring(basePath.length + 1);
    }

    return null;
}
