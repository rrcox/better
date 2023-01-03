import { removeDropdown, renderDropdown } from "../library.js";

class Footer extends HTMLElement {
    constructor() {
        super();
        this.path = this.attributes.path.value;
        this.display();
        this.addEventListeners();
    }
    
    display() {
        this.innerHTML = `
            <nav>
                <div class="center">
                    <div class="icon">
                        <a class="page" href="/">
                            <img src="./images/home.svg", alt="home">
                        </a>
                        <div class="icon-caption">Home</div>
                    </div>
                    <div class="icon">
                        <a class="page" href="/dashboard">
                            <img src="./images/chart.svg", alt="dashboard">
                        </a>
                        <div class="icon-caption">Dashboard</div>
                    </div>
                    <div class="icon">
                        <a class="page" href="/dump">
                            <img src="./images/xray.svg", alt="dump">
                        </a>
                        <div class="icon-caption">Dump</div>
                    </div>
                    <div class="icon">
                        <div class="fullscreen">
                            <img src="${this.path}images/fullscreen.svg", alt="full screen">
                        </div>
                        <div class="icon-caption">Full Screen</div>
                    </div>
                </div>
                <div class="right">
                    <div class="icon">
                        <div class="menu">
                            <img src="./images/more.svg", alt="more">
                        </div>
                        <div class="icon-caption">More</div>
                    </div>
                </div>
            </nav>
        `;
    }
   
    addEventListeners() {
        document.querySelector('body')
            .addEventListener( "click", event => {
                const isOnPage = location.pathname === "/goal";
                const isMenuElement = event.target.parentElement.className  === "menu";
                const isMenuShowing = document.querySelectorAll('div.choices').length > 0;
                
                if (isOnPage){
                    if (isMenuElement) {
                        if (isMenuShowing) {
                            removeDropdown();
                        } else {
                            renderDropdown(location.pathname);
                        }   
                    } else {
                        if (isMenuShowing) {
                            removeDropdown();
                        }
                    }
                }
            });
    }
}

customElements.define("app-footer", Footer);
