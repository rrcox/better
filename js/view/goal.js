import "../component/goalForm.js";

export default (details) => `
    <goal-form 
        label="${details.label}" 
        target="${details.target}"
        actual="${details.actual}"}">
    </goal-form>
`;
