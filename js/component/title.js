class Title extends HTMLElement {
    constructor() {
        super();
        this.display();
    }
    
    display() {
        this.innerHTML = `
            <div>
                Better Every Day
            </div>
        `;
    }
}

customElements.define("app-title", Title);
