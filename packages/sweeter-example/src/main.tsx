import { App } from "./App";

import { createWebRuntime } from "@captainpants/sweeter-web";

createWebRuntime({
    root: document.getElementById('app')!,
    render: () => <App />
})