// ES6 문법을 지원해 export & import를 사용하는 browser과는 달리, nodeJS는 CommonJS module을 사용하기에 require을 사용한다.
const http = require("http");

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

const app = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(notes));
});

const port = 3001;
app.listen(port);
console.log(`Server running on ${port}`);
