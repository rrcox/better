import home from "./view/home.js";
import dashboard from "./view/dashboard.js";
import goal from "./view/goal.js";
import Model from "./model.js";
import store from "./store/store.js";

//-----------------------------------------------------------------------------
// Store
//-----------------------------------------------------------------------------

store.setState('updateLock', false);    
store.setState('values', []);    
store.setState('env', 'dev');

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const model = new Model();

// let values = [
//     {order: 1, label: 'Walking', target: 10, actual:  8 },
//     {order: 2, label: 'Situps',  target: 50, actual: 60 },
//     {order: 3, label: 'Pushups', target: 25, actual: 23 },
//     {order: 4, label: 'Chinups', target: 10, actual:  4 },
// ];
// model.writeValues(values).then( () => {}); 

let values = store.getState('values');
// localStorage.clear();

model.readValues(values).then( () => {
    // localStorage.setItem("values", JSON.stringify(values));
    // values = JSON.parse(localStorage.getItem("values") || "[]");
    store.setState('values', values);
    values = store.getState('values');
});

//-----------------------------------------------------------------------------
// Routing
//-----------------------------------------------------------------------------

const routes = {
    "/": { title: "Home", render: home },
    "/dashboard": { title: "Dashboard", render: dashboard },
    "/goal": { title: "Goal", render: goal },
};

function router(details=null) {
    let view = routes[location.pathname];

    if(details && !details.type) {
        view = routes["/goal"];
        history.replaceState(null, "", "/goal");
        document.title = view.title;
        app.innerHTML = view.render(details);
    } else {
        if (view) {
            document.title = view.title;
            const path = store.getState('env') === 'dev' ? './' : './better/';
            app.innerHTML = view.render(path);
        } else {
            history.replaceState(null, "", "/");
            router();
        }
    }
};

document.querySelectorAll('.page').forEach(page => {
    page.addEventListener("click", event => {
        event.preventDefault();
        console.log("reg:", event.currentTarget.href);
        history.pushState(null, "", event.currentTarget.href);
        router();
    })
});

window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);

//-----------------------------------------------------------------------------
// Synthetic event listener.
//-----------------------------------------------------------------------------

window.addEventListener("barGraphClick", event => {
    history.pushState(null, "", "/goal");
    router(event.detail);
});
