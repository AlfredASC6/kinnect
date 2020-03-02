const express = require("express");
const server = express();
const ejs = require('ejs');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
let roomSockets = [];
server.use(bodyParser.urlencoded({
    extended: true
}))
server.use(cors());
server.use(bodyParser.json());
server.set('view engine','ejs');
server.use(express.static("public"));

server.get("/", (req, res) => {
    res.render("settings")
})
let data;
try{
    data = JSON.parse(fs.readFileSync("database.json","utf8"));
}catch(err){
    data = {
        "users": {},
        "rooms": [],
        "usernames": [],
        "toBeTranslated": []
}

    fs.writeFileSync("database.json", JSON.stringify(data), "utf8")
}
function updateData() {
    fs.writeFileSync("database.json", JSON.stringify(data), "utf8")
}
server.post("/getchat", (req, res) => {
    console.log('chat requested')
    res.send(data.rooms[req.body.index]);
})
// server.post("/translator",(req, res)=> {
//     console.log(req.data.toBeTranslated)

// })
server.post("/newChat", (req, res) => {
    console.log('chat started', req.body)
    data.rooms.push([])
    data.users[req.body.username].rooms.push(req.body.chatID);
    let randomUser = data.usernames[Math.floor(Math.random() * data.usernames.length)];
    while(randomUser == req.body.username){
        randomUser = data.usernames[Math.floor(Math.random() * data.usernames.length)];
    }
    data.users[randomUser].rooms.push(req.body.chatID);
    roomSockets.push(io.of(`/${roomSockets.length - 1}`).on('connection', (socket) => {
    }))
    updateData();
})
server.get("/signin", (req, res) => {
    console.log(req.query)
    if(!data[req.query["user-input"]]){
        data["users"][req.query["user-input"]] = {
            "username": req.query["user-input"],
            "language": req.query["language-input"],
            "rooms": []
        }
        data["usernames"].push(req.query["user-input"]);
        res.render("settings.ejs");
        fs.writeFileSync("database.json", JSON.stringify(data), "utf8")
    }else{
        res.render("home.ejs")
    }
    
})
server.get("/index", (req, res) => {
    res.render("home", {
        username: req.body.username
    });
})
server.get("/profile", (req,res) => {
    res.render("profile", {
        username: req.body.username
    })
})
server.get("/settings", (req,res) => {
    res.render("settings", {
        username: req.body.username
        // this will send the username to this specific ejs file
    })
})
server.get("/sign", (req,res) => {
    res.render("sign", {
        username: req.body.username
    })
})
server.get("/speca", (req,res) => {
    res.render("room", {
        username: req.body.username
    })
})
server.get("/home", (req, res) => {
    res.render("home", {
        username: req.body.username
    })
})
server.post("/chatrooms", (req,res)=> {
    console.log(data.users[req.body.username].rooms)
    res.json({
        rooms: data.users[req.body.username].rooms
    })
})  
server.put("/sendMessage", (req,res) => {
    data.rooms[parseInt(req.body.room)].push(req.body.message) // this should be the laguage I tranlste for api -- req.body.message
    updateData();
})

const app = http.createServer(server);
app.listen(3000, 'localhost');
const io = require('socket.io')(app);
io.on('connection', (socket) => {
    console.log('someone connected');
})
app.on('listening', () => {
    console.log('server running on port 3000')
})
io.on('newmessage', () => {
    console.log('message sent')
})
// for(let i = 0; i < data.rooms.length; i++) {
//     let chat = io.of(`/${i}`).on('newmessage', (socket) => {
//         console.log('test')
//     })
// }
// Imports the Google Cloud client library
// const {Translate} = require('@google-cloud/translate').v2;

// // Creates a client
// const translate = new Translate();

// /**
//  * TODO(developer): Uncomment the following lines before running the sample.
//  */
// const text = 'The text to translate, e.g. Hello, world!';
// const target = 'The target language, e.g. es';

// async function translateText() {
//   // Translates the text into the target language. "text" can be a string for
//   // translating a single piece of text, or an array of strings for translating
//   // multiple texts.
//   let [translations] = await translate.translate(text, target);
//   translations = Array.isArray(translations) ? translations : [translations];
//   console.log('Translations:');
//   translations.forEach((translation, i) => {
//     console.log(`${text[i]} => (${target}) ${translation}`);
//   });
// }

// translateText();