import { cloneObjectArray, removeDropdown, updateAppValues } from "../library.js";
import store from "../store/store.js";

let mode = "edit";

class GoalForm extends HTMLElement {
    constructor() {
        super();
        this.id = this.attributes.id.value;
        this.label = this.attributes.label.value;
        this.target = this.attributes.target.value;
        this.actual = this.attributes.actual.value;
        this.displayForm();
    }
    
    displayForm() {
        this.innerHTML = `
            <div class="container">
                <div id="id" hidden>${this.id}</div>
                <div class="form">
                    <form class="form__goal">
                        <h1>Goals</h1>

                        <br />

                        <div class="floating">
                            <input 
                                id="input__label" 
                                class="floating__input" 
                                name="label" 
                                type="text" 
                                placeholder="label" 
                                value="${this.label}"
                            />
                            <label 
                                for="input__label" 
                                class="floating__label" 
                                data-content="Label">
                                <span class="hidden--visually">Label</span>
                            </label>
                        </div>

                        <div class="floating">
                            <input 
                                id="input__target" 
                                class="floating__input" 
                                name="target" 
                                type="text" 
                                inputmode="numeric"
                                placeholder="target" 
                                value="${this.target}"
                            />
                            <label 
                                for="input__target" 
                                class="floating__label" 
                                data-content="Target"
                            >
                                <span class="hidden--visually">Target</span>
                            </label>
                        </div>

                        <div class="floating">
                            <input 
                                id="input__actual" 
                                class="floating__input" 
                                name="actual" 
                                type="text" 
                                inputmode="numeric"
                                placeholder="actual" 
                                value="${this.actual}"
                            />
                            <label 
                                for="input__actual" 
                                class="floating__label" 
                                data-content="Actual"
                            >
                                <span class="hidden--visually">Actual</span>
                            </label>
                        </div>

                        <input class="button" type="submit" value="Save Goal">
                        <!-- <button class="button">Save Goal</button> -->
                    </form>
                    <div id="addGoal"><img src="../../images/plus.svg"></div>
                </div>
            </div>
        `;
        
        const form = document.getElementsByClassName('form__goal')[0];
        form.addEventListener("submit", this.processForm);
        const addButton = document.getElementById('addGoal');
        addButton.addEventListener("click", addGoal);
        // document.addEventListener("click", cleanup);
    }
    
    processForm(e) {
        if (e.preventDefault) e.preventDefault();

        const button = document.getElementsByClassName('button')[0];
        button.value = "Saving ...";
        button.setAttribute('disabled','');
    
        const labelChangedValue = document.getElementById('input__label').value;
        const targetChangedValue = document.getElementById('input__target').value;
        const actualChangedValue = document.getElementById('input__actual').value;
                
        const originalValues = store.getState('values');
        const changedValues = cloneObjectArray(originalValues);
    
        if (mode === "edit") {
            const id = document.getElementById('id').textContent;
            const changedValue = changedValues.find(value => value.id === id);
            
            changedValue.label = labelChangedValue;
            changedValue.target = +targetChangedValue;
            changedValue.actual = +actualChangedValue;
        } else {
            let maxOrder = Math.max(...changedValues.map(value=> value.order));
            let newGoal = {
                order: maxOrder + 1,
                label: labelChangedValue,
                target: +targetChangedValue,
                actual: +actualChangedValue,
                id: ""
            }
            changedValues.push(newGoal);
        }
    
        console.log("originalValue=",originalValues);
        console.log("changedValue=",changedValues);
        updateAppValues(originalValues, changedValues, 'goalFormSubmitClick', this);

        // const update = async () => {
        //     store.setState('values', changedValues);
        //     await model.updateValues(originalValues, changedValues);
        //     this.dispatchEvent(
        //         new CustomEvent(
        //             'goalFormSubmitClick', 
        //             { bubbles: true }
        //     ));
        // }
        // update();
    
        return false;
    }    
}

function addGoal(){
    mode = "add";

    let label = document.getElementById('input__label');
    let target = document.getElementById('input__target');
    let actual = document.getElementById('input__actual');
    
    label.value = "";
    target.value = "";
    actual.value = "";
}

function cleanup(event) {
    console.log("clicked...");
    event.stopPropagation();
    removeDropdown();
    // document.removeEventListener("click", cleanup);
}

customElements.define("goal-form", GoalForm);
