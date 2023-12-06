import { Reset, partStyles } from "@captainpants/sweeter-gummybear";

//import typescriptLogo from "./typescript.svg";

//import viteLogo from "/vite.svg";

import { $mutable } from "@captainpants/sweeter-core";

export function App(): JSX.Element {
  const value = $mutable("test");

  return (
    <>
      <Reset />
      <div>
        <h1>This is a test</h1>
        <div>
          First:
          <input type="text" class={partStyles.textbox} value={value} />
          <br />
          Second:
          <input type="text" class={partStyles.textbox} value={value} />
        </div>
      </div>
    </>
  );
}
