import { drawBarChart, getMaxProportion } from "../library.js";
import store from "../store/store.js";

class BarChart extends HTMLElement {
    constructor() {
        super();
        this.resize();
        this.addResizeListener();
    }
    
    addResizeListener() {
        window.addEventListener("resize", (event) => {
            this.resize(false);
        });
    }

    resize(withAnimation = true) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        const chartWidth = this.width * 0.8;
        const chartHeight = this.height * 0.4;
        
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
        
        // const values = JSON.parse(localStorage.getItem("values") || "[]");
        const values = store.getState('values');
        // console.log("barChart values:", values);
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
            })
        });

        canvas.addEventListener("mousemove", (event) => {
            let x = event.offsetX;
            let y = event.offsetY;
            let cursorType = 'default';

            for (let i = 0; i < values.length; i++) {
                let value = values[i];

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
                    cursorType = 'pointer';
                    break;
                }
            }
            
            this.style.cursor = cursorType;

            // values.every(value => {
            //     let tx = value.targetLocation.x;
            //     let ty = value.targetLocation.y;
            //     let tw = value.targetLocation.w;
            //     let th = value.targetLocation.h;
            //     let ax = value.actualLocation.x;
            //     let ay = value.actualLocation.y;
            //     let aw = value.actualLocation.w;
            //     let ah = value.actualLocation.h;

            //     if ((x >= tx && x <= tx + tw && y >= ty && y <= ty + th) ||
            //         (x >= ax && x <= ax + aw && y >= ay && y <= ay + ah)) 
            //     {
            //         console.log("in bar");
            //         inShape = true;
            //         cursorType = 'pointer';
            //         return false;

            //         // this.style.cursor = 'pointer';
            //         // return false;    
            //         // this.dispatchEvent(
            //         //     new CustomEvent(
            //         //         'barChartClick', 
            //         //         { 
            //         //             bubbles: true, 
            //         //             detail: {
            //         //                 id: value.id, 
            //         //                 label: value.label,
            //         //                 target: value.target,
            //         //                 actual: value.actual
            //         // }}));
            //     }                 
            // })

            // if (inShape) {
            //     this.style.cursor = cursorType;
            // }
        });
    }
}

customElements.define("bar-chart", BarChart);
