import { RouterLink } from '@serpentis/ptolemy-web';

export function HomePage() {
    return (
        <>
            <h1>Home</h1>
            <ol>
                <li>
                    <RouterLink href={'/page1'}>Page 1</RouterLink>
                </li>
                <li>
                    <RouterLink href={'/page2'}>Page 2</RouterLink>
                </li>
            </ol>
        </>
    );
}
