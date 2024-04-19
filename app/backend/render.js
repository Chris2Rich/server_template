import fs from "fs";

const pages = {"/" : "index.html", "/user" : "user.html"}

function get_frontend_resource(url, res){
    fs.readFile("app/frontend/" + url, "utf-8", (error, result) => {
        if(error){
            res.end("Error 500: internal server error : page content");
        } else {
            res.end(result);
        }
    })
}

export async function get_page(url, res) {

    if(url in pages){
        res.writeHead(200, { "Content-Type": "text/html" });
        get_frontend_resource(pages[url], res)
        return;
    }

    if(url.includes("/user/")){
        res.writeHead(200, { "Content-Type": "text/html" });
        get_frontend_resource("user_index.html", res)
        return;
    }

    if(url.includes("html")){
        res.writeHead(200, { "Content-Type": "text/html" });
        get_frontend_resource(url, res);
        return;
    }

    if(url.includes("css")){
        res.writeHead(200, { "Content-Type": "text/css" });
        get_frontend_resource(url, res);
        return;
    }

    res.writeHead(404, { "Content-Type": "text/json" });
    res.end("Error 404: page not found");
    return;

}