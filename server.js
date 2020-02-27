const express = require("express");
const server = express();
const ejs = require('ejs');
const fs = require('fs');
server.set('view engine','ejs');
server.use(express.static(__dirname));
let data;
try{
    data = JSON.parse(fs.readFileSync("database.json","utf8"));
}catch(err){
    data = {}
    fs.writeFileSync("database.json", JSON.stringify(data), "utf8")
}
server.get("/signin", (req, res) => {
    console.log(data[req.query["usern-iput"]]);
    if(!data[req.query["user-input"]]){
        data[req.query["user-input"]] = {
            "username": req.query["user-input"]
        }
        fs.writeFileSync("database.json", JSON.stringify(data), "utf8")
    }
    res.render("index.ejs")
    
})

server.get("/home", (req, res) => {
    res.render("index.ejs")
})
server.listen(3000, () => {
    console.log(`Server listening at ${3000}`);
});
