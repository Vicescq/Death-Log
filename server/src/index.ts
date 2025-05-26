import express from "express";
import Database from "./Database.js";
import cookieParser from "cookie-parser";


const app = express();
const port = 3000;


app.use(express.json());



app.post("/api/save", (req, res) => {
    Database.instance.run(`
        INSERT INTO users (log)
        VALUES (?)
        
        `, [JSON.stringify(req.body)])
});

app.get("/api/load", (req, res) => {
    let data;
    Database.instance.get(`SELECT log FROM users`, [], (err, row) => {
        console.log(row)
        if (err) {
            console.log(err)
            throw err;
        }
        data = row;
        res.send(data)
    })
});

export type NodeEntry = { userID: string, node: Object };

app.post("/api/add_node", (req, res) => {

    const data = req.body as NodeEntry[];
    let valueSetSQL = "";
    const valueSetArray = [];
    for (let i = 0; i < data.length; i++) {
        const userID = data[i]["userID"];
        const nodeID = data[i]["node"]["_id"];
        const serializedNode = JSON.stringify(req.body[i]["node"]);
        if (i == data.length - 1) {
            valueSetSQL = valueSetSQL + "(?, ?, ?);"
        }
        else {
            valueSetSQL = valueSetSQL + "(?, ?, ?), "
        }
        valueSetArray.push(userID, nodeID, serializedNode);
    }
    const sql = `
        INSERT OR IGNORE INTO nodes (uuid, node_id, node)
        VALUES ${valueSetSQL}
    `
    Database.instance.run(sql, [...valueSetArray], ((err) => err ? console.log(err) : null));


    console.log("ADDED:", req.body);
    res.status(200).send("Success!");
})


app.post("/api/delete_node", (req, res) => {
    const data = req.body as string[];
    let valueSetSQL = "(";
    const valueSetArray = [];
    for (let i = 0; i < data.length; i++) {
        const nodeID = data[i];
        if (i == data.length - 1) {
            valueSetSQL = valueSetSQL + "?);"
        }
        else {
            valueSetSQL = valueSetSQL + "?,  "
        }
        valueSetArray.push(nodeID);
    }
    const sql = `
        DELETE FROM nodes
        WHERE node_id in ${valueSetSQL}
    `
    Database.instance.run(sql, [...valueSetArray], ((err) => err ? console.log(err) : null));

    console.log("DELETE:", req.body);
    res.status(200).send("Success!");
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
