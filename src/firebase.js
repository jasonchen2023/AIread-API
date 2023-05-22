/* eslint-disable no-unused-vars */
// eslint-disable import/prefer-default-export

const admin = require('firebase-admin');

const serviceAccount = require('../credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

// export { addRandomItem };
