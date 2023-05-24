/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */

const admin = require('firebase-admin');

const serviceAccount = require('../credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const auth = admin.auth();

export { auth };
