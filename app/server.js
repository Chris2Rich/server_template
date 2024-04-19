import https from "node:https";
import http from "node:http";
import fs from "node:fs";

const IP = "192.168.1.106";

const SSL = { 
    key: fs.readFileSync("app/keys/.key"), 
    cert: fs.readFileSync("app/keys/.cert"), 
}; 

function get_resource(url, res){
    fs.readFile("app/resources/" + url, "utf-8", (error, result) => {
        if(error){
            res.end("Error 500: internal server error : page content");
        } else {
            res.end(result);
        }
    })
    return;
}

const https_server = https.createServer(SSL, async (req, res) => {

    if(res.url.includes("html")){
        res.writeHead(200, { "Content-Type": "text/html" });
        get_resource(res.url, res);
        return;
    }

    if(res.url.includes("css")){
        res.writeHead(200, { "Content-Type": "text/css" });
        get_resource(res.url, res);
        return;
    }

    res.writeHead(404, { "Content-Type": "text/json" });
    res.end("Error 404: page not found");
    return;
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