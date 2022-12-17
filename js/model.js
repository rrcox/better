import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
import { getFirestore, collection, doc, addDoc, getDocs, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore-lite.js';
import store from './store/store.js';

export default class Model {
    constructor() {
        this.firebaseConfig = {
            apiKey: "AIzaSyDHvfzLoOzSzsZuS6C-4cM43hsNxbzpNSY",
            authDomain: "bettereveryday-2bdc8.firebaseapp.com",
            projectId: "bettereveryday-2bdc8",
            storageBucket: "bettereveryday-2bdc8.appspot.com",
            messagingSenderId: "636949545943",
            appId: "1:636949545943:web:9d1af63f74ad4fe6bf4192"
        };
        this.app = initializeApp(this.firebaseConfig);
        this.db = getFirestore(this.app);        
    }

    async readValues(values) {
        const snapshot = await getDocs(collection(this.db, "values"));
        snapshot.forEach(doc => {
            values.push({
                order: doc.data().order,
                label: doc.data().label,
                target: doc.data().target,
                actual: doc.data().actual,
                id: doc.id
            }); 
        });
        values.sort((a, b) => {
            if(a.order > b.order) return 1;
            if(a.order < b.order) return -1;
            return 0;
        });
    }

    async writeValues(values) {
        console.log("write values:",values);
        try {
            for (const value of values) {
                const docRef = await addDoc(collection(this.db, "values"), {
                    order: value.order,
                    label: value.label,
                    target: value.target,
                    actual: value.actual
                });    
            }
        } catch (e) {
            console.error("Error adding records: ", e);
        }
    }

    async deleteValues(values) {
        if (!values.length) {
            return;
        }

        try {
            for (const value of values) {
                await deleteDoc(doc(this.db, "values", value.id));
            }
        } catch (e) {
            console.error("Error deleting records: ", e);
        }
    }

    async updateValues(originalValues, changedValues) {
        if (!store.getState('updateLock')){
            store.setState('updateLock', true);
            await this.deleteValues(originalValues);
            await this.writeValues(changedValues);
            const values = [];
            await this.readValues(values)
            // localStorage.setItem("values", JSON.stringify(values)); 
            store.setState('values', values);
            store.setState('updateLock', false);
        }
    }
}
