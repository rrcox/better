import store from "../store/store.js"

export default () => `
<div id="dump">
    ${store.dump()}
</div>
`;
