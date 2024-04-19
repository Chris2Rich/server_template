import https from "node:https";
import http from "node:http";
import fs from "node:fs";

import {get_page} from "./backend/render.js"
import {authorize} from "./backend/auth.js"

const IP = "192.168.1.106";

const SSL = { 
    key: fs.readFileSync("app/backend/keys/.key"), 
    cert: fs.readFileSync("app/backend/keys/.cert"), 
}; 

// Server attempts to delegate request function to a file otherwise assumes page needs to be loaded

const https_server = https.createServer(SSL, async (req, res) => {
    switch(req.url){
        case("/auth.js"):
            console.log(req);
            const authorized = await authorize(req, res);
            return;

        default:
            get_page(req.url, res);
            return;
    }
});

const http_server = http.createServer(async (req, res) => {
    res.writeHead(301, {Location: "https://" + req.headers.host + req.url});
    res.end();
    return;
});

https_server.listen(443);
http_server.listen(80);
setTimeout(() => {https_server.close()}, 1000*10);
setTimeout(() => {http_server.close()}, 1000*10);