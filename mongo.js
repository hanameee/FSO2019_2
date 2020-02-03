const mongoose = require("mongoose");

const password = process.argv[2];
const nameParam = process.argv[3];
const numberParam = process.argv[4];
const url = `mongodb+srv://hannah:${password}@cluster0-wd05v.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
    name: nameParam,
    number: numberParam
});

if (process.argv.length < 3) {
    console.log("please give password as argument");
    process.exit(1);
} else if (process.argv.length === 5) {
    person.save().then(response => {
        console.log(`$added ${nameParam} ${numberParam} to phonebook`);
        mongoose.connection.close();
    });
} else if (process.argv.length === 3) {
    console.log("phonebook:");
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person);
        });
        mongoose.connection.close();
    });
}
