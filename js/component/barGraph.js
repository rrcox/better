import { drawBarGraph, getMaxProportion } from "../library.js";
import store from "../store/store.js";

class BarGraph extends HTMLElement {
    constructor() {
        super();
        this.resize();
        this.addResizeListener();
    }
    
    addResizeListener() {
        window.addEventListener("resize", (event) => {
            this.resize();
        });
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        const graphWidth = this.width * 0.8;
        const graphHeight = this.height * 0.4;
        
        this.innerHTML =  `
            <div id="canvas-div">
                <canvas 
                    id="canvas"
                    width=${graphWidth} 
                    height=${graphHeight}
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
        
        // const values = JSON.parse(localStorage.getItem("values") || "[]");
        const values = store.getState('values');
        const maxProportion = getMaxProportion(values);

        drawBarGraph(values, graphHeight, graphWidth, maxProportion, context);  
        this.addBarGraphListener();      
    }

    addBarGraphListener() {
        // const values = JSON.parse(localStorage.getItem("values") || "[]");
        const values = store.getState('values');
        const canvas = document.getElementById("canvas")
        
        canvas.addEventListener("click", (event) => {
            let x = event.offsetX;
            let y = event.offsetY;
            
            values.forEach(value => {
                let tx = value.targetLocation.x;
                let ty = value.targetLocation.y;
                let tw = value.targetLocation.w;
                let th = value.targetLocation.h;
                let ax = value.actualLocation.x;
                let ay = value.actualLocation.y;
                let aw = value.actualLocation.w;
                let ah = value.actualLocation.h;

                if ((x >= tx && x <= tx + tw && y >= ty && y <= ty + th) ||
                    (x >= ax && x <= ax + aw && y >= ay && y <= ay + ah)) 
                {
                    this.dispatchEvent(
                        new CustomEvent(
                            'barGraphClick', 
                            { 
                                bubbles: true, 
                                detail: { 
                                    label: value.label,
                                    target: value.target,
                                    actual: value.actual
                    }}));
                }
            })
        });
    }
}

customElements.define("bar-graph", BarGraph);
