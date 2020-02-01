const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static("build"));
app.use(bodyParser.json());
const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    // request.body는 bodyParser에 의해 할당되므로 bodyParser을 use한 다음에 requestLogger을 사용해야한다!
    console.log("Body:  ", request.body);
    console.log("---");
    // 다음 middleware 으로의 control
    next();
};
app.use(requestLogger);
let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
];

app.get("/api", (req, res) => {
    res.send("<h1>Ch3 Phonebook Exercise</h1>");
});

app.get("/api/info", (req, res) => {
    const numOfPersons = persons.length;
    const currentTime = new Date();
    res.send(`<div>Phonebook has info for <b>${numOfPersons}</b> persons</div>
    <div>${currentTime}</div>`);
});

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

const generateId = () => {
    return Math.floor(Math.random() * 1000000);
};

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.name) {
        return res.status(400).json({
            error: "name missing"
        });
    } else if (!body.number) {
        return res.status(400).json({
            error: "number missing"
        });
    } else if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: "name must be unique"
        });
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    };
    persons = persons.concat(person);
    res.json(person);
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
