require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Note = require("./models/note");
app.use(express.static("build"));
app.use(bodyParser.json());
app.use(cors());
morgan.token("data", function(req, res) {
    return JSON.stringify(req.body);
});
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :data"
    )
);
app.get("/api", (req, res) => {
    res.send("<h1>hello world!</h1>");
});

// get all notes
app.get("/api/notes", (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes.map(note => note.toJSON()));
    });
});

// fetch specific note
app.get("/api/notes/:id", (req, res) => {
    Note.findById(req.params.id).then(note => {
        res.json(note.toJSON());
    });
});

// delete specific note
app.delete("/api/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter(note => note.id !== id);
    // status code 204 : no content
    res.status(204).end();
});

// post note and return that note - bodyparser required
app.post("/api/notes", (req, res) => {
    const body = req.body;
    if (body.content === undefined) {
        return res.status(400).json({
            error: "content missing"
        });
    }
    const note = new Note({
        content: body.content,
        important: body.imporatant || false,
        date: new Date()
    });
    note.save().then(savedNote => {
        console.log(savedNote);
        res.json(savedNote.toJSON);
    });
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
