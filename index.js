// ES6 문법을 지원해 export & import를 사용하는 browser과는 달리, nodeJS는 CommonJS module을 사용하기에 require을 사용한다.
const express = require("express");
// express is function that is used to create an express application (stored in the app variable)
const app = express();
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

app.get("/notes", (req, res) => {
    res.json(notes);
});

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
