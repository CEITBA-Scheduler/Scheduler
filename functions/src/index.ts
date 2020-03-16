import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


export const test = functions.firestore.document("usersSelection/{uid}").onWrite(
    (change, context) => {
        //console.log(change.after.data());

        var preIncrement = [];
        var preDecrement = [];

        var increment: any[] = [];
        var decrement: any[] = [];

        var isInInc: {[code: string]: boolean} = {};
        var isInDec: {[code: string]: boolean} = {};

        if (change.before.exists && change.before.data()){
            const data = change.before.data();
            if (data){
               // console.log(data);
                //console.log(data["options"]["userFirstOption"]);
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
                //console.log(data);
                //console.log(data["options"]);
                //console.log(data["options"]["userFirstOption"]);
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
        var totalQueries : {[code: string]: string} = {};

        for (let inc of increment){
            totalQueries[inc.subjectCode] = inc.subjectName;
        }
        for (let dec of decrement){
            totalQueries[dec.subjectCode] = dec.subjectName;
        }
        console.log("Total queries = ");
        console.log(totalQueries);

        const db = admin.firestore();
        var count: number = 0;

        var allData : {[code: string]: any} = {};

        for (let query of Object.keys(totalQueries)){
            console.log(`asking ${query} - ${totalQueries[query]}`);

            db.collection("subjectAnalytics").doc(`${query}`).get().then(doc => {
                allData[query] = doc;
                console.log(`answer of ${query} - ${totalQueries[query]} received`);
                count ++;
                if (count == Object.keys(totalQueries).length){
                    updateData(allData, increment, decrement);
                }
            });
        }

        console.log("program has finished");
    return 1;
});

function updateData(allData: {[code: string]: any}, increment : any[], decrement: any[]){
    const db = admin.firestore();

    console.log("All data was obtained");
    console.log(allData);
    console.log("updating db");

    for (let inc of increment){
        console.log(`updating increment ${inc}`);
        console.log(`asking for ${inc.subjectCode}`);

        var doc = allData[inc.subjectCode];
        if (!doc.exists){
            console.log(`document does not exist, writting ${inc.subjectCode}/${inc.commission}=1`);

            db.collection("subjectAnalytics").doc(`${inc.subjectCode}`).set({
                [`${inc.commission}`]: 1,
                subjectName: inc.subjectName
            }, {merge: true}).then(data => {
            }).then(data => {
                console.log(`successfully written ${inc.subjectCode}/${inc.commission}`)
            });
        }else{
            console.log(`document does exist, incrementing ${inc.subjectCode}/${inc.commission}`);
            const data = doc.data();

            if (data){
                console.log("there is data in document")
                console.log(data[`${inc.commission}`]);
                const prevValue : number = data[`${inc.commission}`];

                console.log(`prevValue = ${prevValue}`);

                if (prevValue == undefined){
                    console.log("not valid prev value");
                    db.collection("subjectAnalytics").doc(`${inc.subjectCode}`).set({
                        [`${inc.commission}`]: 1
                    }, {merge: true}).then(data => {
                        console.log(`successfully written ${inc.subjectCode}/${inc.commission}`)
                    });
                }else{
                    console.log("valid prev value");
                    db.collection("subjectAnalytics").doc(`${inc.subjectCode}`).set({
                        [`${inc.commission}`]: prevValue + 1
                    }, {merge: true}).then(data => {
                        console.log(`successfully written ${inc.subjectCode}/${inc.commission}`)
                    });
                }
            }else{
                console.log("there is no data in document")
            }
        }
    }

    for (var dec of decrement){
        console.log(`updating decrement ${dec}`);
        console.log(`asking for ${dec.subjectCode}`);

        let doc = allData[dec.subjectCode];

        if (!doc.exists){
            console.log(`document does not exist, writting ${dec.subjectCode}/${dec.commission}=0`);

            db.collection("subjectAnalytics").doc(`${dec.subjectCode}`).set({
                [`${dec.commission}`]: 0,
                subjectName: dec.subjectName
            }, {merge: true}).then(data => {
            }).then(data => {
                console.log(`successfully written ${dec.subjectCode}/${dec.commission}`)
            });
        }else{
            console.log(`document does exist, decrementing ${dec.subjectCode}/${dec.commission}`);
            const data = doc.data();

            if (data){
                console.log("there is data in document")
                console.log(data[`${dec.commission}`]);
                let prevValue : number = data[`${dec.commission}`];

                console.log(`prevValue = ${prevValue}`);

                if (prevValue == undefined){
                    console.log("not valid prev value");
                    db.collection("subjectAnalytics").doc(`${dec.subjectCode}`).set({
                        [`${dec.commission}`]: 0
                    }, {merge: true}).then(data => {
                        console.log(`successfully written ${dec.subjectCode}/${dec.commission}`)
                    });
                }else{
                    console.log("valid prev value");
                    db.collection("subjectAnalytics").doc(`${dec.subjectCode}`).set({
                        [`${dec.commission}`]: prevValue - 1,
                    }, {merge: true}).then(data => {
                        console.log(`successfully written ${dec.subjectCode}/${dec.commission}`)
                    });
                }
            }else{
                console.log("there is no data in document")
            }
        }
    }
}

    /*    console.log("increment = ");
        console.log(increment);
        console.log("decrements = ");
        console.log(decrement);


        for (let inc of increment){
            console.log(`updating increment ${inc}`);
            console.log(`asking for ${inc.subjectCode}`);

            db.collection("subjectAnalytics").doc(`${inc.subjectCode}`).get().then(doc => {
                console.log(`answer of ${inc.subjectCode} received`);

                if (!doc.exists){
                    console.log(`document does not exist, writting ${inc.subjectCode}/${inc.commission}=1`);

                    db.collection("subjectAnalytics").doc(`${inc.subjectCode}`).set({
                        [`${inc.commission}`]: 1,
                        subjectName: inc.subjectName
                    }, {merge: true}).then(data => {
                    }).then(data => {
                        console.log(`successfully written ${inc.subjectCode}/${inc.commission}`)
                    });
                }else{
                    console.log(`document does exist, incrementing ${inc.subjectCode}/${inc.commission}`);
                    const data = doc.data();

                    if (data){
                        console.log("there is data in document")
                        console.log(data[`${inc.commission}`]);
                        var prevValue : number = data[`${inc.commission}`];

                        console.log(`prevValue = ${prevValue}`);

                        if (prevValue == undefined){
                            console.log("not valid prev value");
                            db.collection("subjectAnalytics").doc(`${inc.subjectCode}`).set({
                                [`${inc.commission}`]: (prevValue + 1)
                            }, {merge: true}).then(data => {
                                console.log(`successfully written ${inc.subjectCode}/${inc.commission}`)
                            });
                        }else{
                            console.log("valid prev value");
                            db.collection("subjectAnalytics").doc(`${inc.subjectCode}`).set({
                                [`${inc.commission}`]: 1
                            }, {merge: true}).then(data => {
                                console.log(`successfully written ${inc.subjectCode}/${inc.commission}`)
                            });
                        }
                    }else{
                        console.log("there is no data in document")
                    }
                }
            });
        }


        for (let dec of decrement){
            console.log(`updating decrement ${dec}`);
            console.log(`asking for ${dec.subjectCode}`);

            db.collection("subjectAnalytics").doc(`${dec.subjectCode}`).get().then(doc => {
                console.log(`answer of ${dec.subjectCode} received`);

                if (!doc.exists){
                    console.log(`document does not exist, writting ${dec.subjectCode}/${dec.commission}=0`);

                    db.collection("subjectAnalytics").doc(`${dec.subjectCode}`).set({
                        [`${dec.commission}`]: 0,
                        subjectName: dec.subjectName
                    }, {merge: true}).then(data => {
                    }).then(data => {
                        console.log(`successfully written ${dec.subjectCode}/${dec.commission}`)
                    });
                }else{
                    console.log(`document does exist, decrementing ${dec.subjectCode}/${dec.commission}`);
                    const data = doc.data();

                    if (data){
                        console.log("there is data in document")
                        console.log(data[`${dec.commission}`]);
                        var prevValue : number = data[`${dec.commission}`];

                        console.log(`prevValue = ${prevValue}`);

                        if (prevValue == undefined){
                            console.log("not valid prev value");
                            db.collection("subjectAnalytics").doc(`${dec.subjectCode}`).set({
                                [`${dec.commission}`]: (prevValue - 1)
                            }, {merge: true}).then(data => {
                                console.log(`successfully written ${dec.subjectCode}/${dec.commission}`)
                            });
                        }else{
                            console.log("valid prev value");
                            db.collection("subjectAnalytics").doc(`${dec.subjectCode}`).set({
                                [`${dec.commission}`]: 1
                            }, {merge: true}).then(data => {
                                console.log(`successfully written ${dec.subjectCode}/${dec.commission}`)
                            });
                        }
                    }else{
                        console.log("there is no data in document")
                    }
                }
            });
        }*/

       /* console.log("program has finished");
        return 1;
    }
);*/
