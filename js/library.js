import store from "./store/store.js";
import model from "./model.js";

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
    const drawCurrent = 1;
    const drawStop = 100;
    const animationSpeed = 5;
    const targetGradStartColor = "#64B5F6";
    const targetGradStopColor = "#1565C0";
    const actualGradStartColor = "#81C784";
    const actualGradStopColor = "#2E7D32";
    const labelFont = "14px Arial";
    const labelColor = "black";
    const labelAlign = "center";
    const labelSpace = 20;
    const distance = 0;

    settings = {
        topGapPct, 
        barWidth, 
        xOffset, 
        barGap, 
        height, 
        drawCurrent, 
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
        labelSpace,
        distance,
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
    const labelSpace = settings.labelSpace;

    let x;
    let y;
    let proportion;
    let targetHeight;
    let actualHeight;
    let targetGradient;
    let actualGradient;
    let location;
    let finalTargetHeight;
    let finalActualHeight;

    settings.values.forEach((value, i) => {
        proportion = 1 - value.actual / value.target ;

        if (maxProportion > 0) {
            targetHeight = height * topGapPct;
            actualHeight = targetHeight - proportion * targetHeight;
        } else {
            targetHeight = height * topGapPct / (1 - maxProportion);
            actualHeight = targetHeight * (1 - proportion);
        }

        finalTargetHeight = targetHeight;
        finalActualHeight = actualHeight;
        
        if (withAnimation) {
            targetHeight = getCubicEase(settings.drawCurrent, 0, finalTargetHeight, drawStop)
            actualHeight = getCubicEase(settings.drawCurrent, 0, finalActualHeight, drawStop)
        }

        x = xOffset + (i * barWidth * 2) + (i * barGap);
        y = height - targetHeight - labelSpace;

        targetGradient = context.createLinearGradient(x, 0, x + barWidth, 0);
        targetGradient.addColorStop(0, targetGradStartColor);
        targetGradient.addColorStop(1, targetGradStopColor);
        context.fillStyle = targetGradient;

        context.fillRect(x, y, barWidth, targetHeight);
        location = {x: x, y: y, w: barWidth, h: targetHeight};
        value['targetLocation'] = location;

        x = xOffset + barWidth + (i * barWidth * 2) + (i * barGap);
        y = height - actualHeight - labelSpace;
        
        actualGradient = context.createLinearGradient(x, 0, x + barWidth, 0);
        actualGradient.addColorStop(0, actualGradStartColor);
        actualGradient.addColorStop(1, actualGradStopColor);
        context.fillStyle = actualGradient;

        context.fillRect(x, y, barWidth, actualHeight);
        location = {x: x, y: y, w: barWidth, h: actualHeight};
        value['actualLocation'] = location;
    });

    if (withAnimation) {
        if (settings.drawCurrent < drawStop) {
            settings.drawCurrent++;
            setTimeout(drawAnimatedBars, animationSpeed);
        }
    }
}

function getCubicEase(currentHeight, startPos, finalHeight, totalSteps) {
    currentHeight /= totalSteps/2;

    if (currentHeight < 1) {
        return (finalHeight / 2) * (Math.pow(currentHeight, 3)) + startPos;
    }

    currentHeight -= 2;

    return (finalHeight / 2) * (Math.pow(currentHeight, 3) + 2) + startPos;
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

export function deleteGoal(element) {
    try{
        const id = document.querySelector('#id').textContent;
        console.log("id:",id);
        const originalValues = store.getState('values');
        const changedValues = originalValues.filter(value => value.id !== id);
        console.log("originalValue=",originalValues);
        console.log("changedValue=",changedValues);
        updateAppValues(originalValues, changedValues, "goalDeleteClick", element);
    } catch(error) {
        console.error("Error deleting document:", error);
    }
}

export function updateAppValues (originalValues, changedValues, customEvent, element) {
    const update = async () => {
        console.log('"element (this):',element);
        store.setState('values', changedValues);
        await model.updateValues(originalValues, changedValues);
        element.dispatchEvent(
            new CustomEvent(
                customEvent, 
                { bubbles: true }
        ));
    }
    update();
}

export function renderDropdown(pathname) {
    console.log("render dropdown...")
    const menu = document.querySelector('.right ');
    const choices = document.createElement('div');
    choices.className = "choices";
    menu.appendChild(choices);
    
    switch(pathname) {
        case "/goal":
            const choice1 = document.createElement('div');
            choice1.className = "choice";
            choice1.textContent = "Delete Goal";
            const choice2 = document.createElement('div');
            choice2.className = "choice";
            choice2.textContent = "Other Stuff";
            choices.appendChild(choice1);
            choices.appendChild(choice2);

            choice1.addEventListener("click", event => {
                console.log("currentTarget:",event.currentTarget);
                console.log("target:",event.target.parentNode);
                
                // event.stopPropagation();
                deleteGoal(choice1);
            });
            
            // document.addEventListener("click", );

            break;
    }
}

export function removeDropdown() {
    let choices = document.querySelector('.choices');
    if (choices) {
        choices.parentNode.removeChild(choices);
    }
}

export function toggleFullScreen(path) {
    const fullscreen = document.querySelector(".fullscreen");
    const caption = document.querySelector(".fullscreen + .icon-caption");
    if (!document.fullscreenElement) {
        fullscreen.innerHTML = `<img src="${path}images/exit.svg" alt="exit full screen">`;
        caption.textContent = "Exit Full"
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        fullscreen.innerHTML = `<img src="${path}images/fullscreen.svg" alt="full screen">`;  
        caption.textContent = "Full Screen"
        document.exitFullscreen();
    }
}
