import express from "express";
import Database from "./Database.js";
import cookieParser from "cookie-parser";


const app = express();
const port = 3000;


app.use(express.json());






app.post("/api/nodes/:uuid", (req, res) => {
    const toAdd = [];
    const toDelete = [];
    const toUpdate = [];

    const actionHistory = req.body;
    console.log(actionHistory)
    const uuid = req.params.uuid;
    console.log(JSON.stringify(actionHistory, null, 4));
    let toAddOrUpdateSQLHolders = "";

    for (let i = 0; i < actionHistory.length; i++) {
        const action = actionHistory[i];
        for (let j = 0; j < action._targets.length; j++) {
            const nodeID = action._targets[j]._id;
            const node = JSON.stringify(action._targets[j]);

            if (action._type == "add") {
                toAdd.push(uuid, nodeID, node);

                if (toAddOrUpdateSQLHolders === "") {
                    toAddOrUpdateSQLHolders = "(?, ?, ?)";
                }
                else {
                    toAddOrUpdateSQLHolders += ", (?, ?, ?)";
                }
            }

            else if (action._type == "update") {
                toUpdate.push(node, nodeID);
            }

            else {
                toDelete.push(nodeID);
            }
        }
    }


    if (toAdd.length > 0) {
        const sqlAddorUpdate = `
            INSERT OR IGNORE INTO nodes (uuid, node_id, node)
            VALUES ${toAddOrUpdateSQLHolders}
        `;
        Database.instance.run(sqlAddorUpdate, [...toAdd], ((err) => err ? console.log(err) : null));
    }

    if (toDelete.length > 0) {
        const placeholders = toDelete.map(() => '?').join(', ');
        const sqlDelete = `DELETE FROM nodes WHERE uuid = ? AND node_id IN (${placeholders})`;
        Database.instance.run(sqlDelete, [uuid, ...toDelete], ((err) => err ? console.log(err) : null));
    }

    if (toUpdate.length > 0) {
        const sql = `
            UPDATE nodes
            SET node = ?
            WHERE node_id = ? 
        `
        let j = 1
        for (let i = 0; i < toUpdate.length - 1; i++) {
            Database.instance.run(sql, [toUpdate[i], toUpdate[j]], ((err) => err ? console.log(err) : null))
            j++
        }

    }

    console.log("PROCESSED:", req.body);
    res.status(200).send("Success!");
});

app.get("/api/nodes/:uuid", (req, res) => {
    const uuid = req.params.uuid;
    res.set("content-type", "application/json");

    let data: any[] = [];
    const sql = `
        SELECT node_id, node
        FROM nodes
        WHERE uuid = ?
    `
    Database.instance.all(sql, [uuid], (err, rows) => {
        if (err) {
            console.log(err)
            throw err;
        }
        else{
            rows.forEach((row: any) => {
                const node_id = row.node_id;
                const node = row.node
                const dataRow = {[node_id]: node};
                data.push(dataRow);
            })
            res.json(data);
        }
    })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
