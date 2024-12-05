const admin = require("firebase-admin");
const serviceAccount = require("../../dsw-02-rest-firebase-adminsdk-7dhjy-03051c4265.json"); // Descarga tu clave desde Firebase Console

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://dsw-02-rest.appspot.com", // Reemplaza con el bucket de tu proyecto
});

const bucket = admin.storage().bucket();

module.exports = bucket;
