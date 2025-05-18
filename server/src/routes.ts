import http from "node:http"

export default function routes(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; }) {
    if (req.url === "/api") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify({ message: "Home" }));
    }

    else if (req.url === "/abc") {
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("Abc")
    }
}

