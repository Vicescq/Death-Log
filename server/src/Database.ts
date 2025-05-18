import sqlite3 from "sqlite3";


export default class Database{
    dbDriver = sqlite3.verbose();

    constructor(){
        this.dbDriver = this.dbDriver
    }
}


// const sqlite3Verbose = sqlite3.verbose()


// let sql;

// const db = new sqlite3Verbose.Database("../app.db", sqlite3Verbose.OPEN_READWRITE, (err: any) => {
//     if(err) return console.error(err);
// })

// sql =`CREATE TABLE users(id INTEGER PRIMARY KEY,first_name,last_name,username,password )`;

// const drop = `DROP table users`

// db.run(sql); 