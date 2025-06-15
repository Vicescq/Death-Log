import admin from "firebase-admin"
import serviceAccount from "../serviceAccountKey.json" with {type: "json"};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export async function verifyToken(req, res, next) {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const verifiedToken = await admin.auth().verifyIdToken(token);
        if (verifiedToken){
            console.log("11111111")
            return next();
        }
        else{
            return res.sendStatus(403);
        }
    }
    catch(error){
        console.log(error)
        return res.sendStatus(403);
    }
}