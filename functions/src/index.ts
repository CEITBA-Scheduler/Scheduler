import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


export const test = functions.firestore.document("users/{uid}").onWrite(
    (change, context) => {
        console.log(change.after.data());

        var preIncrement = [];
        var preDecrement = [];

        var increment: any[] = [];
        var decrement: any[] = [];

        var isInInc: {[code: string]: boolean} = {}; 
        var isInDec: {[code: string]: boolean} = {}; 

        if (change.before.exists && change.before.data()){
            const data = change.before.data();
            if (data){    
                console.log(data);
                console.log(data["options"]["userFirstOption"]);
                const userSelection = data["options"]["userFirstOption"]["userSelection"];
                

                if (userSelection){
                    for (let selection of userSelection){
                        preDecrement.push({
                            commission: selection.commission,
                            subjectCode: selection.subjectCode,
                            subjectName: selection.subjectName
                        });
                        isInDec[selection.commission+selection.subjectCode] = true;
                    }
                }
            }
            
        }


        if (change.after.exists && change.after.data()){
            const data = change.after.data();
            
            if (data){
                console.log(data);
                console.log(data["options"]);
                console.log(data["options"]["userFirstOption"]);
                const userSelection = data["options"]["userFirstOption"]["userSelection"];

                if (userSelection){
                    for (let selection of userSelection){
                        preIncrement.push({
                            commission: selection.commission,
                            subjectCode: selection.subjectCode,
                            subjectName: selection.subjectName
                        });
                        isInInc[selection.commission+selection.subjectCode] = true;
                    }
                }
            }
        /*if (val){
            console.log(val.options.userFirstOption.userSelection);
        }*/

        }

        /// borrar repetidos

        for (let inc of preIncrement){
            if (!((inc.commission+inc.subjectCode) in isInDec)){
                increment.push(inc);
            }
        }
        for (let dec of preDecrement){
            if (!((dec.commission+dec.subjectCode) in isInInc)){
                decrement.push(dec);
            }
        }
        console.log("hello world my friends");

        console.log(increment);
        console.log(decrement);

        const db = admin.firestore();

        console.log("increment");
        for (let inc of increment){
            db.collection("subjectAnalytics").doc(`${inc.subjectCode}`).get().then(doc => {
                if (!doc.exists){
                    console.log("not exist");
                    db.collection("subjectAnalytics").doc(`${inc.subjectCode}`).set({
                        [`${inc.commission}`]: 1,
                        subjectName: inc.subjectName
                    }, {merge: true}).then(data => {
                        console.log(data);
                    });
                }else{
                    console.log("exist");
                    const data = doc.data();
                    console.log(data);
                    if (data){
                        var prevValue = data[`${inc.commission}`];
                        if (!prevValue){
                            db.collection("subjectAnalytics").doc(`${inc.subjectCode}`).set({
                                [`${inc.commission}`]: (prevValue + 1)
                            }, {merge: true});
                        }else{
                            db.collection("subjectAnalytics").doc(`${inc.subjectCode}`).set({
                                [`${inc.commission}`]: 1
                            }, {merge: true});
                        }
                    }
                }
            });

        }
        console.log("decrement");
        for (let dec of decrement){
            db.collection("subjectAnalytics").doc(`${dec.subjectCode}`).get().then(doc => {
                if (!doc.exists){
                    console.log("not exist");
                    db.collection("subjectAnalytics").doc(`${dec.subjectCode}`).set({
                        [`${dec.commission}`]: 0,
                        subjectName: dec.subjectName
                    }, {merge: true}).then(data => {
                        console.log(data);
                    });;
                }else{
                    console.log("exist");
                    const data = doc.data();
                    console.log(data);

                    if (data){
                        var prevValue = data[`${dec.commission}`];
                        if (!prevValue){
                            db.collection("subjectAnalytics").doc(`${dec.subjectCode}`).set({
                                [`${dec.commission}`]: (prevValue - 1)
                            }, {merge: true});
                        }else{
                            db.collection("subjectAnalytics").doc(`${dec.subjectCode}`).set({
                                [`${dec.commission}`]: 0
                            }, {merge: true});
                        }
                    }
                }
            });
        }

        console.log(increment);
        console.log(decrement);

        console.log("hello world my friends");
    }
);