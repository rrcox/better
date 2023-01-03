class Header extends HTMLElement {
    constructor() {
        super();
        this.display();
    }
    
    display() {
        this.innerHTML = `
            <div>Better Every Day</div>
            <svg
                xmlns="http://www.w3.org/2000/svg" 
                height="24" 
                width="24"
                viewbox="0 0 48 48"
            >
                <path 
                    fill="yellow" 
                    d="M22.5 9.5V2h3v7.5Z
                        m12.8 5.3-2.1-2.1 5.3-5.35 2.1 2.15Z
                        m3.2 10.7v-3H46v3ZM22.5 46v-7.5h3V46Z
                        m-9.85-31.25L7.4 9.5l2.1-2.1 5.3 5.3Z
                        m25.9 25.85-5.35-5.3 2.05-2.05 5.4 5.2Z
                        M2 25.5v-3h7.5v3Z
                        m7.55 15.1L7.4 38.5l5.25-5.25 1.1 1 1.1 1.05Z
                        M24 36q-5 0-8.5-3.5T12 24q0-5 3.5-8.5T24 12
                        q5 0 8.5 3.5T36 24q0 5-3.5 8.5T24 36Z
                        m0-3q3.75 0 6.375-2.625T33 24
                        q0-3.75-2.625-6.375T24 15
                        q-3.75 0-6.375 2.625T15 24
                        q0 3.75 2.625 6.375T24 33Z
                        m0-9Z"
                />
            </svg>
        `;
    }
}

customElements.define("app-header", Header);
