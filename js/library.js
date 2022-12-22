import store from "./store/store.js";

let settings;

export function drawBarChart(values, height, width, maxProportion, context, withAnimation = true) {
    
    setSettings(values, height, width, maxProportion, context, withAnimation);    
    drawBarLabels();
    drawAnimatedBars(withAnimation);

    store.setState('values', values);
}

function setSettings(values, height, width, maxProportion, context, withAnimation) {
    
    const topGapPct = 0.85;
    const barWidth = Math.floor(width / ((values.length * 2) + values.length + 1)); 
    const xOffset = barWidth;
    const barGap = barWidth;
    const drawStart = 1;
    const drawStop = 100;
    const animationSpeed = 5;
    const targetGradStartColor = "#64B5F6";
    const targetGradStopColor = "#1565C0";
    const actualGradStartColor = "#81C784";
    const actualGradStopColor = "#2E7D32";
    const labelFont = "14px Arial";
    const labelColor = "black";
    const labelAlign = "center";

    settings = {
        topGapPct, 
        barWidth, 
        xOffset, 
        barGap, 
        height, 
        drawStart, 
        drawStop,        
        animationSpeed, 
        maxProportion, 
        targetGradStartColor, 
        targetGradStopColor, 
        actualGradStartColor, 
        actualGradStopColor, 
        labelFont,
        labelColor,
        labelAlign,
        context, 
        values,
    };
}

function drawAnimatedBars(withAnimation = true) {

    const topGapPct = settings.topGapPct;
    const barWidth = settings.barWidth;
    const xOffset = settings.xOffset;
    const barGap = settings.barGap;
    const height = settings.height;
    const maxProportion = settings.maxProportion;
    const context = settings.context;
    const drawStop = settings.drawStop;
    const animationSpeed = settings.animationSpeed;
    const targetGradStartColor = settings.targetGradStartColor;
    const targetGradStopColor = settings.targetGradStopColor;
    const actualGradStartColor = settings.actualGradStartColor;
    const actualGradStopColor = settings.actualGradStopColor;

    let x;
    let y;
    let proportion;
    let targetHeight;
    let actualHeight;
    let targetGradient;
    let actualGradient;
    let location;

    settings.values.forEach((value, i) => {
        proportion = 1 - value.actual / value.target ;

        if (maxProportion > 0) {
            targetHeight = height * topGapPct;
            actualHeight = targetHeight - proportion * targetHeight;
        } else {
            targetHeight = height * topGapPct / (1 - maxProportion);
            actualHeight = targetHeight * (1 - proportion);
        }

        if (withAnimation) {
            targetHeight *= (settings.drawStart * (1 / drawStop));
            actualHeight *= (settings.drawStart * (1 / drawStop));
        }

        x = xOffset + (i * barWidth * 2) + (i * barGap);
        y = height - targetHeight - 20;
        
        targetGradient = context.createLinearGradient(x, 0, x + barWidth, 0);
        targetGradient.addColorStop(0, targetGradStartColor);
        targetGradient.addColorStop(1, targetGradStopColor);
        context.fillStyle = targetGradient;

        context.fillRect(x, y, barWidth, targetHeight);
        location = {x: x, y: y, w: barWidth, h: targetHeight};
        value['targetLocation'] = location;

        x = xOffset + barWidth + (i * barWidth * 2) + (i * barGap);
        y = height - actualHeight - 20;
        
        actualGradient = context.createLinearGradient(x, 0, x + barWidth, 0);
        actualGradient.addColorStop(0, actualGradStartColor);
        actualGradient.addColorStop(1, actualGradStopColor);
        context.fillStyle = actualGradient;

        context.fillRect(x, y, barWidth, actualHeight);
        location = {x: x, y: y, w: barWidth, h: actualHeight};
        value['actualLocation'] = location;
    });

    if (withAnimation) {
        if (settings.drawStart < drawStop) {
            settings.drawStart++;
            setTimeout(drawAnimatedBars, animationSpeed);
        }
    }
}

function drawBarLabels() {
    const context = settings.context;
    const barWidth = settings.barWidth;
    const height = settings.height;
    const xOffset = settings.xOffset;
    const barGap = settings.barGap;
    const values = settings.values;
    const labelFont = settings.labelFont;
    const labelColor = settings.labelColor;
    const labelAlign = settings.labelAlign;

    context.font = labelFont;
    context.fillStyle = labelColor;
    context.textAlign = labelAlign;

    values.forEach((value, i) => {
        let x = xOffset + barWidth + (i * barWidth * 2) + (i * barGap);
        let label = getFittedLabel(value.label, barWidth, context);
        context.fillText(label, x, height-4);
    });   
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
