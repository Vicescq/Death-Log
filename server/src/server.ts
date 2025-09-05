import "dotenv/config.js";
import express from "express";
import { Pool } from "pg";
import { clerkMiddleware } from "@clerk/express";
import { verifyUser } from "./middleware.js";
import cors from "cors"
import { AddEvent, DeleteEvent, DeleteGameEvent } from "./types/EventModel.js";
import { DistinctTreeNode } from "./types/TreeNodeModel.js";

const app = express();
const port = 3000;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const client = await pool.connect();

app.use(express.json({ limit: "100mb" }));
app.use(clerkMiddleware());
app.use(cors());
app.use(verifyUser);

app.get("/nodes", async (req, res) => {
    try {
        const query = {
            text: "SELECT node FROM nodes WHERE email = $1",
            values: [req.email]
        }
        const response = await client.query(query);
        const nodesUnprocessed = response.rows;
        const nodesProcessed: DistinctTreeNode[] = []
        nodesUnprocessed.forEach((unprocessed) => {
            nodesProcessed.push(unprocessed.node);
        })
        res.status(200).json(nodesProcessed);
        return;
    }
    catch (e) {
        console.error(e)
    }
    res.sendStatus(500);
})

app.post("/nodes", async (req, res) => {
    try {
        await client.query("BEGIN");

        const addEvent = req.body as AddEvent;

        if (!addEvent.sideEffects) {
            const addGame = {
                text: "INSERT INTO nodes(email, node_id, node) VALUES($1, $2, $3)",
                values: [req.email, addEvent.data.id, addEvent.data]
            }
            await client.query(addGame);
        }

        else {
            const addProfileOrSubject = {
                text: "INSERT INTO nodes(email, node_id, node) VALUES($1, $2, $3)",
                values: [req.email, addEvent.data.id, addEvent.data]
            }
            const updateGameOrProfileParent = {
                text: "UPDATE nodes SET node = $1 WHERE email = $2 AND node_id = $3",
                values: [addEvent.sideEffects.updatedParent, req.email, addEvent.sideEffects.updatedParent.id]
            }
            await client.query(addProfileOrSubject);
            await client.query(updateGameOrProfileParent);
        }

        await client.query("COMMIT");
        res.sendStatus(200);
        return;
    }

    catch (e) {
        await client.query("ROLLBACK");
        console.error(e)
    }
    res.sendStatus(500);
})

app.delete("/nodes", async (req, res) => {
    try {
        await client.query("BEGIN");
        const deleteEvent = req.body as DeleteEvent;
        const commonDelQuery = "DELETE FROM nodes WHERE node_id = $1 AND email = $2"
        await client.query({
            text: commonDelQuery,
            values: [deleteEvent.data, req.email]
        });



        switch (deleteEvent.subtype) {
            case "game":
                deleteEvent.sideEffects.deletedLineage.forEach(async (idToBeDel) => {
                    const deleteChild = {
                        text: commonDelQuery,
                        values: [idToBeDel, req.email]
                    }
                    await client.query(deleteChild);
                })
                break;
            case "profile":
                const deleteSubject = {
                    text: commonDelQuery,
                    values: [deleteEvent.sideEffects.deletedLineage, req.email]
                }
                await client.query(deleteSubject);

                const updateGame = {
                    text: "UPDATE nodes SET node = $1 WHERE email = $2 AND node_id = $3",
                    values: [deleteEvent.sideEffects.updatedParent, req.email, deleteEvent.sideEffects.updatedParent.id]
                }
                await client.query(updateGame);
                break;

            case "subject":
                await client.query({ text: "UPDATE nodes SET node = $1 WHERE email = $2 AND node_id = $3", values: [deleteEvent.sideEffects.updatedLineage[0], req.email] })
                await client.query({ text: "UPDATE nodes SET node = $1 WHERE email = $2 AND node_id = $3", values: [deleteEvent.sideEffects.updatedLineage[0], req.email] })
                break;
        }

        await client.query("COMMIT");
        console.log(deleteEvent)
        res.sendStatus(200);
        return;
    }

    catch (e) {
        await client.query("ROLLBACK");

    }
    res.sendStatus(500);
})

app.put("/nodes", async (req, res) => {
    try {
        await client.query("BEGIN");

        await client.query("COMMIT");
    }

    catch (e) {
        await client.query("ROLLBACK");
    }
    res.status(500);
})

app.post("/users", async (req, res) => {

    try {
        const existingUser = {
            text: "SELECT * FROM users WHERE email = $1",
            values: [req.email]
        }
        const qRes = await client.query(existingUser);
        if (qRes.rowCount == 0) {
            const registerUser = {
                text: "INSERT INTO users(email) VALUES($1)",
                values: [req.email]
            }
            await client.query(registerUser);
            res.sendStatus(201);
            return;
        }
        res.sendStatus(200);
        return;
    }
    catch (e) {
        console.error(e);
    }

    res.sendStatus(500);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


