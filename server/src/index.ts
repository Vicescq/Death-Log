import "dotenv/config.js";
import express from "express";
import { Pool } from "pg"
import Database from "./Database.js";
import { text } from "stream/consumers";

const app = express();
const port = 3000;

const pool = new Pool({
    connectionString: process.env.URL
});
const client = await pool.connect();

app.use(express.json({ limit: '50mb' }));


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
        for (let j = 0; j < action.targets.length; j++) {
            if (typeof action.targets[j] == "string") {
                toDelete.push(action.targets[j]);
            }
            else {
                const nodeID = action.targets[j].id;
                const node = JSON.stringify(action.targets[j]);

                if (action.type == "add") {
                    toAdd.push(uuid, nodeID, node);

                    if (toAddOrUpdateSQLHolders === "") {
                        toAddOrUpdateSQLHolders = "(?, ?, ?)";
                    }
                    else {
                        toAddOrUpdateSQLHolders += ", (?, ?, ?)";
                    }
                }

                else if (action.type == "update") {
                    toUpdate.push(node, nodeID);
                }
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

app.get("/api/nodes/:uuid", async (req, res) => {

    const uuid = req.params.uuid;
    res.set("content-type", "application/json");
    const sql = `
        SELECT node
        FROM nodes
        WHERE uuid = $1
    `
    const query = {
        text: sql,
        values: [uuid],
        rowMode: "array",
    }
    await client.query(query, (err, rows) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(rows.rows.map((row) => JSON.parse(row[0])));
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
