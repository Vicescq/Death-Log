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



app.post("/api/node", (req, res) => {
    const toAddOrUpdate = [];
    const toDelete = [];
    const toUpdate = [];

    const data = req.body;
    const userID = data.userID;

    let toAddOrUpdateSQLHolders = "";

    for (let i = 0; i < data.actionHistory.length; i++) {
        const action = data.actionHistory[i];
        for (let j = 0; j < action._targets.length; j++) {
            const nodeID = action._targets[j]._id;
            const node = JSON.stringify(action._targets[j]);

            if (action._type == "add") {
                toAddOrUpdate.push(userID, nodeID, node);

                if (toAddOrUpdateSQLHolders === "") {
                    toAddOrUpdateSQLHolders = "(?, ?, ?)";
                }
                else {
                    toAddOrUpdateSQLHolders += ", (?, ?, ?)";
                }
            }

            else if (action._type == "update"){
                toUpdate.push(node, nodeID);
            }

            else {
                // Only store nodeID since userID is the same for all
                toDelete.push(nodeID);
            }
        }
    }


    if (toAddOrUpdate.length > 0) {
        const sqlAddorUpdate = `
            INSERT OR IGNORE INTO nodes (uuid, node_id, node)
            VALUES ${toAddOrUpdateSQLHolders}
        `;
        Database.instance.run(sqlAddorUpdate, [...toAddOrUpdate], ((err) => err ? console.log(err) : null));
    }

    if (toDelete.length > 0) {
        const placeholders = toDelete.map(() => '?').join(', ');
        const sqlDelete = `DELETE FROM nodes WHERE uuid = ? AND node_id IN (${placeholders})`;
        Database.instance.run(sqlDelete, [userID, ...toDelete], ((err) => err ? console.log(err) : null));
    }

    if (toUpdate.length > 0){
        const sql = `
            UPDATE nodes
            SET node = ?
            WHERE node_id = ? 
        `
        let j = 1
        for (let i = 0; i < toUpdate.length - 1; i++){
            Database.instance.run(sql, [toUpdate[i], toUpdate[j]], ((err) => err ? console.log(err) : null))
            j++
        }
        
    }

    console.log("PROCESSED:", req.body);
    res.status(200).send("Success!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
