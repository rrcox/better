class Store {
    constructor() {
        this.state = {};
    }

    setState(prop, value = null) {
        this.state[prop] = value;
    }

    getState(prop) {
        return this.state[prop];
    } 
}


const store = new Store();
export default store;