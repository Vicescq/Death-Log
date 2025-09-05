/// <reference types="@clerk/express/env" />
import * as express from "express-serve-static-core"
declare global {
    namespace Express {
        interface Request {
            email?: string
        }
    }
}