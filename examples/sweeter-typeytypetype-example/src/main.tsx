import { enableDeveloperMode } from '@captainpants/sweeter-core';
import { App } from './App.js';

import { createWebRuntime } from '@captainpants/sweeter-web';

enableDeveloperMode(true);

createWebRuntime({
    root: document.getElementById('app')!,
    render: () => <App />,
});
