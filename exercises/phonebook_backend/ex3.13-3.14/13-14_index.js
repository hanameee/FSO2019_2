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

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
