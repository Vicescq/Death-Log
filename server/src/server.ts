import "dotenv/config.js";
import express from "express";
import { Pool } from "pg"

const app = express();
const port = 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
const client = await pool.connect();

app.use(express.json({ limit: '50mb' }));


app.post("/api/nodes/:uuid", async (req, res) => {
    const toAdd = [];
    const toDelete = [];
    const toUpdate = [];

    const actionHistory = req.body;
    const uuid = req.params.uuid;
    console.log(JSON.stringify(actionHistory, null, 4));
    let toAddSQLHolder = "";
    let toAddParamIndex = 1;

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

                    if (toAddSQLHolder === "") {
                        toAddSQLHolder = `($${toAddParamIndex}, $${toAddParamIndex + 1}, $${toAddParamIndex + 2})`;
                    }
                    else {
                        toAddSQLHolder += `, ($${toAddParamIndex}, $${toAddParamIndex + 1}, $${toAddParamIndex + 2})`;
                    }
                    toAddParamIndex += 3
                }

                else if (action.type == "update") {
                    toUpdate.push(node, nodeID);
                }
            }
        }
    }

    if (toAdd.length > 0) {
        const sqlAdd = `
            INSERT INTO nodes (uuid, node_id, node)
            VALUES ${toAddSQLHolder}
        `;
        const query = {
            text: sqlAdd,
            values: [...toAdd],
        }
        console.log(toAddSQLHolder, [...toAdd])
        await client.query(query, (err) => err ? console.log(err) : null)
    }

    if (toDelete.length > 0) {
        const placeholders = toDelete.map((_, i) => `$${i + 2}`).join(', ');
        const sqlDelete = `DELETE FROM nodes WHERE uuid = $1 AND node_id IN (${placeholders})`;
        const query = {
            text: sqlDelete,
            values: [uuid, ...toDelete],
        };
        await client.query(query, (err) => err ? console.log(err) : null);
    }

    if (toUpdate.length > 0) {
        const sqlUpdate = `
            UPDATE nodes
            SET node = $1
            WHERE node_id = $2 
        `
        let j = 1
        for (let i = 0; i < toUpdate.length - 1; i++) {
            await client.query(sqlUpdate, [toUpdate[i], toUpdate[j]], (err) => err ? console.log(err) : null)
            j++;
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
