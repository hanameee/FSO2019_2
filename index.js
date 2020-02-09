require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Note = require("./models/note");
app.use(express.static("build"));
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
    Note.findById(req.params.id)
        .then(note => {
            if (note) {
                res.json(note.toJSON());
            } else {
                res.status(404).end();
            }
        })
        .catch(error => {
            next(error);
        });
});

// delete specific note
app.delete("/api/notes/:id", (req, res, next) => {
    Note.findByIdAndRemove(req.params.id)
        .then(result => {
            console.log(result);
            res.status(204).end();
        })
        .catch(error => next(error));
});

// toggle importance of a note
app.put("/api/notes/:id", (req, res, next) => {
    const body = req.body;
    const note = {
        content: body.content,
        important: body.important
    };

    Note.findByIdAndUpdate(req.params.id, note, { new: true })
        .then(updatedNote => {
            res.json(updatedNote.toJSON());
        })
        .catch(error => next(error));
});

// post note and return that note - bodyparser required
app.post("/api/notes", (req, res, next) => {
    const body = req.body;
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });
    note.save().then(savedNote => {
        console.log(savedNote);
        res.json(savedNote.toJSON());
    }).catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === "CastError" && error.kind === "ObjectId") {
        return res.status(400).send({ error: "malformatted id" });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
    next(error);
};

app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
