import sqlite3 from "sqlite3";

export default class Database {

    private static _instance: sqlite3.Database;
    private constructor() { };

    public static get instance() {
        if (!Database._instance) {
            const sqlite3Verbose = sqlite3.verbose()
            const db = new sqlite3Verbose.Database("../app.db", sqlite3Verbose.OPEN_READWRITE, (err) => {
                if (err) return console.error(err);
            })
            Database._instance = db;
        }
        return Database._instance
    }
}
