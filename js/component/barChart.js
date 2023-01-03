import store from "../store/store.js";
import { drawBarChart, getMaxProportion, inBars } from "../library.js";

class BarChart extends HTMLElement {
    constructor() {
        super();
        this.resize(window.innerWidth, window.innerHeight);
        this.boundResizeHandler = this.barChartResize.bind(this);
    }
    
    connectedCallback() {
        window.addEventListener("resize", this.boundResizeHandler);
    }

    disconnectedCallback() {
        window.removeEventListener("resize", this.boundResizeHandler);
    }

    barChartResize() {
        this.resize(window.innerWidth, window.innerHeight, false);
    }

    resize(width, height, withAnimation = true) {
        const chartWidth = width * 0.8;
        const chartHeight = height * 0.4;

        this.innerHTML =  `
            <div id="canvas-div">
                <canvas 
                    id="canvas"
                    width=${chartWidth} 
                    height=${chartHeight}
                >
                </canvas>
            </div>
            <div id="legend">
                <div>Target</div>
                <div id="targetColor"></div>
                <div>Actual:</div>
                <div id="actualColor"></div>
            </div>
        `;
                                    
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        
        const values = store.getState('values');
        const maxProportion = getMaxProportion(values);

        drawBarChart(values, chartHeight, chartWidth, maxProportion, context, withAnimation);  
        this.addBarChartListeners();      
    }

    addBarChartListeners() {
        const values = store.getState('values');
        const canvas = document.getElementById("canvas")
        
        canvas.addEventListener("click", (event) => {
            let x = event.offsetX;
            let y = event.offsetY;

            const value = inBars(x, y, values);

            if (value) {
                this.dispatchEvent(
                    new CustomEvent(
                        'barChartClick', 
                        { 
                            bubbles: true, 
                            detail: {
                                id: value.id, 
                                label: value.label,
                                target: value.target,
                                actual: value.actual
                }}));
            }
        });

        canvas.addEventListener("mousemove", (event) => {
            let x = event.offsetX;
            let y = event.offsetY;
            let cursorType = 'default';

            if (inBars(x, y, values)) {
                cursorType = 'pointer';                
            }

            this.style.cursor = cursorType;
        });
    }
}

customElements.define("bar-chart", BarChart);
