import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
export const test = functions.firestore.document("users/{uid}/options/userFirstOption").onWrite(
    (change, context) => {
        console.log(change.after.data());

        const val = change.after.data();
        if (val){
            console.log(val.userSelection);
        }
        console.log("hello world my friends");
    }
);