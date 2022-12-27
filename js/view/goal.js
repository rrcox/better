import "../component/goalForm.js";

export default (path, details) => `
    <goal-form 
        id="${details.id}" 
        label="${details.label}" 
        target="${details.target}"
        actual="${details.actual}"}"
        path="${path}"}"
    >
    </goal-form>
`;
