// The only documentation I can find on jsxs is https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#always-pass-children-as-props
// which says "The jsxs function indicates that the top array was created by React.".
export { jsx, jsx as jsxs } from './runtime/jsx.js';
export { Fragment } from '@captainpants/sweeter-core';