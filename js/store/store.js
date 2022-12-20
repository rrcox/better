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

    dump() {
        return JSON.stringify(this.state);
    }
}


const store = new Store();
export default store;