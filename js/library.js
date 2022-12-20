import store from "./store/store.js";

export function drawBarChart(values, height, width, maxProportion, context) {
    const topGapPct = 0.85;
    const barWidth = Math.floor(width / ((values.length * 2) + values.length + 1)); 
    const xOffset = barWidth;
    const barGap = barWidth;
    
    let x;
    let y;
    let proportion;
    let targetHeight;
    let actualHeight;
    let targetGradient;
    let actualGradient;
    let location;
    let label;

    values.forEach((value, i) => {
        if (maxProportion > 0) {
            proportion = 1 - value.actual / value.target ;
            targetHeight = height * topGapPct;
            actualHeight = targetHeight - proportion * targetHeight;
        } else {
            proportion = 1 - value.actual / value.target ;
            targetHeight = height * topGapPct / (1 - maxProportion);
            actualHeight = targetHeight * (1 - proportion);
        }

        x = xOffset + (i * barWidth * 2) + (i * barGap);
        y = height - targetHeight - 20;
        targetGradient = context.createLinearGradient(x, 0, x + barWidth, 0);
        targetGradient.addColorStop(0, "#64B5F6");
        targetGradient.addColorStop(1, "#1565C0");
        context.fillStyle = targetGradient;
        context.fillRect(x, y, barWidth, targetHeight);
        location = {x: x, y: y, w: barWidth, h: targetHeight};
        value['targetLocation'] = location;

        x = xOffset + barWidth + (i * barWidth * 2) + (i * barGap);
        y = height - actualHeight - 20;
        actualGradient = context.createLinearGradient(x, 0, x + barWidth, 0);
        actualGradient.addColorStop(0, "#81C784");
        actualGradient.addColorStop(1, "#2E7D32");
        context.fillStyle = actualGradient;
        context.fillRect(x, y, barWidth, actualHeight);
        location = {x: x, y: y, w: barWidth, h: actualHeight};
        value['actualLocation'] = location;
        
        context.font = "14px Arial";
        context.fillStyle = "black";
        context.textAlign = "center";
        label = getFittedLabel(value.label, barWidth, context);
        context.fillText(label, x, height-4);
    });

    // localStorage.setItem("values", JSON.stringify(values));
    store.setState('values', values);
}

export function getMaxProportion(values) {
    let maxValue = 1 - values[0].actual / values[0].target;

    values.forEach(value => {
        let proportion = 1 - value.actual / value.target;
        if (Math.abs(proportion) >= Math.abs(maxValue) && proportion < 0 ) {
            maxValue = proportion;
        }
    })

    return maxValue;
}

function getFittedLabel(label, barWidth, context) {
    let fittedLabel = label;
    let metrics = context.measureText(label);
    let overflowFactor = 1.2;

    while (metrics.width > barWidth * 2 * overflowFactor) {
        fittedLabel = fittedLabel.slice(0, -1);
        metrics = context.measureText(fittedLabel)
    }

    return fittedLabel;
}

export function cloneObjectArray(original) {
    let clone = original.map( obj => {
        return {...obj}
    });
    return clone;
}
