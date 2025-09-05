import { getAuth, clerkClient } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.auth().isAuthenticated) {
        res.sendStatus(401);
        return;
    }

    else {
        const authObj = getAuth(req);
        if (authObj.userId) {
            const user = await clerkClient.users.getUser(authObj.userId)
            req.email = user.primaryEmailAddress?.emailAddress
            next();
            return;
        }
    }
    res.sendStatus(400);
}