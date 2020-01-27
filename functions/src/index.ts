import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
export const test = functions.database.ref("users/{uid}").onWrite(
    (event, context) => {
        console.log(event.before.val());
    }
);