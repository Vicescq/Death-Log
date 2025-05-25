import express from "express";
import Database from "./Database.js";

const app = express();
const port = 3000;


app.use(express.json());

app.post("/api/save", (req, res) => {
    res.send('Got a POST request')
    Database.instance.run(`
        INSERT INTO users (log)
        VALUES (?)
        
        `, [JSON.stringify(req.body)])
});

app.get("/api/load", (req, res) => {
    let data;
    Database.instance.get(`SELECT log FROM users`, [], (err, row) => {
        console.log(row)
        if(err){
            console.log(err)
            throw err;
        }
        data = row;
        res.send(data)
    })

    
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
