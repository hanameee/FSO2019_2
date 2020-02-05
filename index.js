require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
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
app.get("/api/info", (req, res) => {
    const numOfPersons = persons.length;
    const currentTime = new Date();
    res.send(`<div>Phonebook has info for <b>${numOfPersons}</b> persons</div>
    <div>${currentTime}</div>`);
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
