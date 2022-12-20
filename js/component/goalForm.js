import { cloneObjectArray } from "../library.js";
import model from "../model.js";
import store from "../store/store.js";

class GoalForm extends HTMLElement {
    constructor() {
        super();
        this.label = this.attributes.label.value;
        this.target = this.attributes.target.value;
        this.actual = this.attributes.actual.value;
        this.displayForm();
    }
    
    displayForm() {
        this.innerHTML = `
            <div class="container">
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
                </div>
            </div>
        `;
        
        const form = document.getElementsByClassName('form__goal')[0];
        form.addEventListener("submit", this.processForm);
    }
    
    processForm(e) {
        if (e.preventDefault) e.preventDefault();
        
        const button = document.getElementsByClassName('button')[0];
        button.value = "Saving ...";
        button.setAttribute('disabled','');

        const labelChangedValue = document.getElementById('input__label').value;
        const targetChangedValue = document.getElementById('input__target').value;
        const actualChangedValue = document.getElementById('input__actual').value;
               
        // const originalValues = JSON.parse(localStorage.getItem("values") || "[]");
        const originalValues = store.getState('values');

        const changedValues = cloneObjectArray(originalValues);
        const changedValue = changedValues.find(value => value.label === this.label.value);
        
        changedValue.label = labelChangedValue;
        changedValue.target = +targetChangedValue;
        changedValue.actual = +actualChangedValue;

        // const model = new Model();
        // console.log("originalValue=",originalValues);
        // console.log("changedValue=",changedValues);
        const update = async () => {
            store.setState('values', changedValues);
            await model.updateValues(originalValues, changedValues);
            this.dispatchEvent(
                new CustomEvent(
                    'goalFormSubmitClick', 
                    { bubbles: true }
            ));
        }
        update();

        return false;
    }    
}

customElements.define("goal-form", GoalForm);
