// ES6 문법을 지원해 export & import를 사용하는 browser과는 달리, nodeJS는 CommonJS module을 사용하기에 require을 사용한다.
const express = require("express");
// express is function that is used to create an express application (stored in the app variable)
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());
morgan.token("data", function(req, res) {
    return JSON.stringify(req.body);
});
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :data"
    )
);
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
];

// define routes
app.get("/", (req, res) => {
    res.send("<h1>hello world!</h1>");
});

// get all notes
app.get("/notes", (req, res) => {
    res.json(notes);
});

// fetch specific note
app.get("/notes/:id", (req, res) => {
    // request의 params로 넘어오는 id는 type이 string이기에 number로 변환해줘야 find method를 사용할 수 있다
    const id = Number(req.params.id);
    const note = notes.find(
        note =>
            // console.log(note.id, typeof note.id, id, typeof id, note.id === id);
            note.id === id
    );
    if (note) {
        res.json(note);
    } else {
        res.status(404).end();
    }
});

// delete specific note
app.delete("/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter(note => note.id !== id);
    // status code 204 : no content
    res.status(204).end();
});

// logic for generating new id
const generateId = () => {
    const maxId =
        notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0;
    return maxId + 1;
};
// post note and return that note - bodyparser required
app.post("/notes", (req, res) => {
    const body = req.body;
    if (!body.content) {
        // status code 400 : bad request
        return res.status(400).json({
            error: "content missing"
        });
    }
    const note = {
        content: body.content,
        important: body.imporatant || false,
        date: new Date(),
        id: generateId()
    };
    notes = notes.concat(note);
    res.json(note);
});

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
