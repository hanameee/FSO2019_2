require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");
app.use(express.static("build"));
app.use(bodyParser.json());
app.use(cors());
morgan.token("data", function(req, res) {
    return JSON.stringify(req.body);
});
(":method :url :status :res[content-length] - :response-time ms :data");
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :data"
    )
);

app.get("/api", (req, res) => {
    res.send("<h1>Ch3 Phonebook Exercise</h1>");
});

app.get("/api/people", (req, res) => {
    Person.find({}).then(people => {
        console.log(people);
        res.json(people.map(person => person.toJSON()));
    });
});

app.get("/api/people/:id", (req, res) => {
    Person.findById(req.params.id)
        .then(people => {
            res.json(people.toJSON());
        })
        .catch(error => {
            console.log(error);
            res.status(404).end();
        });
});

app.post("/api/people", (req, res) => {
    const body = req.body;
    if (body.name === undefined) {
        return res.status(400).json({
            error: "name missing"
        });
    }
    const person = new Person({
        name: body.name,
        number: body.number
    });
    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON());
    });
});

app.delete("/api/people/:id", (req, res) => {
    Person.findByIdAndRemove(req.params.id, { useFindAndModify: false })
        .then(result => res.status(204).end())
        .catch(error => {
            next(error);
        });
});

app.put("/api/people/:id", (req, res) => {
    const body = req.body;
    const person = {
        name: body.name,
        number: body.number
    };
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON());
        })
        .catch(error => {
            next(error);
        });
});

const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === "CastError" && error.kind === "ObjectId") {
        return res.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }
    next(error);
};

app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
