import admin from "firebase-admin"
var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export async function verifyToken(req: any, res: any, next: any) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verifiedToken = await admin.auth().verifyIdToken(token);
        if (verifiedToken) {
            return next();
        }
        else {
            return res.sendStatus(403);
        }
    }
    catch (error) {
        console.log(error)
        return res.sendStatus(403);
    }
}