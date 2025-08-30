import "dotenv/config.js";
import express from "express";
import { Pool } from "pg";
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { verifyToken } from "./middleware.js";


const app = express();
const port = 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const client = await pool.connect();

app.use(express.json({ limit: "50mb" }));
app.use(verifyToken);

app.post("/api/nodes/:email", async (req, res) => {
    // validate token email with param email here
    try {
        const email = req.params.email;
        const nodes: any[] = req.body;
        const records: any[] = [];
        let placeholders = "";
        let placeholderIndex = 0;
        nodes.forEach((node, i) => {
            records.push(email, node.id, node);
            if (i == nodes.length - 1) {
                placeholders += `($${++placeholderIndex}, $${++placeholderIndex}, $${++placeholderIndex})`
            }
            else {
                placeholders += `($${++placeholderIndex}, $${++placeholderIndex}, $${++placeholderIndex}), `
            }
        })

        const sql = `
            INSERT INTO nodes (email, node_id, node)
            VALUES ${placeholders}
        `
        await client.query(sql, records);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.delete("/api/nodes/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const toBeDeletedIDS: any[][] = req.body;
        const records: any[] = [];
        let placeholders = "";
        let placeholderIndex = 1;

        // flatten
        toBeDeletedIDS.forEach((deletedIDSSubArr) => {
            records.push(...deletedIDSSubArr);
        })

        records.forEach((_, i) => {
            if (i == records.length - 1) {
                placeholders += `$${++placeholderIndex}`;
            }
            else {
                placeholders += `$${++placeholderIndex}, `;
            }
        });
        records.unshift(email);

        const sql = `
            DELETE FROM nodes WHERE email = $1 AND node_id in (${placeholders})
        `
        console.log(sql, records)
        await client.query(sql, records);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})


app.post("/api/signin/", async (req, res) => {
    try {
        const email = req.body.email;
        const result = await client.query("SELECT email FROM users WHERE email = $1", [email]);
        if (!result.rowCount) {
            client.query("INSERT INTO users(email) VALUES ($1)", [email]);
            console.log("SUCCESS")

        }
        else {
            console.log("DUPLICATE!")
        }
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});