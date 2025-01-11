import { createWebRuntime } from '@captainpants/sweeter-web';

import { App } from './App.js';

createWebRuntime({
    root: document.getElementById('app')!,
    render: () => <App />,
});
