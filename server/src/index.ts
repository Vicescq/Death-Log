import http from "node:http"
import routes from "./routes.js";
import Database from "./Database.js";


const server = http.createServer((req, res) => routes(req, res));

const a = new Database();



server.listen(3000, () => {
    console.log("Server running on port 3000")
})


