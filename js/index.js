import appTitle from "./view/appTitle.js";
import appHeader from "./view/appHeader.js";
import appFooter from "./view/appFooter.js";
import home from "./view/home.js";
import dashboard from "./view/dashboard.js";
import goal from "./view/goal.js";
import dump from "./view/dump.js";
import model from "./model.js";
import store from "./store/store.js";
import { removeDropdown, toggleFullScreen } from "./library.js";

//-----------------------------------------------------------------------------
// Setup store.
//-----------------------------------------------------------------------------

store.setState('updateLock', false);    
store.setState('values', []);    
// store.setState('env', 'dev');
store.setState('env', 'prod');


//-----------------------------------------------------------------------------
// Load data.
//-----------------------------------------------------------------------------

// Test scenario
// let values = [
    //     {order: 1, label: 'Walking', target: 10, actual:  8 },
//     {order: 2, label: 'Situps',  target: 50, actual: 60 },
//     {order: 3, label: 'Pushups', target: 25, actual: 23 },
//     {order: 4, label: 'Chinups', target: 10, actual:  4 },
// ];

// const load = async () => {
//     await model.writeValues(values);
//     store.setState('values', values);
//     values = store.getState('values');
// };

//Prod scenario
const load = async () => {
    let values = [];
    await model.readValues(values);
    store.setState('values', values);
    values = store.getState('values');
};
load();

//-----------------------------------------------------------------------------
// Get path path based on environment.
//-----------------------------------------------------------------------------

const path = store.getState('env') === 'dev' ? './' : './better/';

//-----------------------------------------------------------------------------
// Initial base render.
//-----------------------------------------------------------------------------

apptitle.innerHTML = appTitle();
appheader.innerHTML = appHeader();
appfooter.innerHTML = appFooter(path);

//-----------------------------------------------------------------------------
// Setup routing.
//-----------------------------------------------------------------------------

const routes = {
    "/": { title: "Better Every Day - Home", render: home },
    "/dashboard": { title: "Dashboard", render: dashboard },
    "/goal": { title: "Goal", render: goal },
    "/dump": { title: "Dump", render: dump },
};

function router(details=null) {
    let view = routes[location.pathname];

    if(details && !details.type) {
        view = routes["/goal"];
        history.replaceState(null, "", "/goal");
        document.title = view.title;
        app.innerHTML = view.render(path, details);
    } else {
        if (view) {
            document.title = view.title;
            app.innerHTML = view.render(path);
        } else {
            history.replaceState(null, "", "/");
            router();
        }
    }
};

//-----------------------------------------------------------------------------
// Add page listeners for routes. 
//-----------------------------------------------------------------------------

document.querySelectorAll('.page').forEach(page => {
    page.addEventListener("click", event => {
        event.preventDefault();
        history.pushState(null, "", event.currentTarget.href);
        router();
    })
});

window.addEventListener("popstate", router);
window.addEventListener("DOMContentLoaded", router);

//-----------------------------------------------------------------------------
// Add synthetic event listeners.
//-----------------------------------------------------------------------------

window.addEventListener("barChartClick", event => {
    history.pushState(null, "", "/goal");
    router(event.detail);
});

window.addEventListener("goalFormSubmitClick", event => {
    history.pushState(null, "", "/dashboard");
    router();
});

window.addEventListener("goalDeleteClick", event => {
    removeDropdown();
    history.pushState(null, "", "/dashboard");
    router();
});

//-----------------------------------------------------------------------------
// Add fullscreen listener.
//-----------------------------------------------------------------------------

const fullScreen = document.querySelector(".fullscreen");
fullScreen.addEventListener("click", event => {
    toggleFullScreen(path);
});
            

