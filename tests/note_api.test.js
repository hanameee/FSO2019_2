const mongoose = require("mongoose");
const supertest = require("supertest");
const Note = require("../models/note");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);

beforeEach(async () => {
    await Note.deleteMany({});
    const noteObjects = helper.initialNotes.map(note => new Note(note));
    const promiseArray = noteObjects.map(note => note.save());
    await Promise.all(promiseArray);
});

test("notes are returned as json", async () => {
    await api
        .get("/api/notes")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test("there are four notes", async () => {
    const response = await api.get("/api/notes");
    expect(response.body.length).toBe(helper.initialNotes.length);
});

test("the first note is about HTTP methods", async () => {
    const response = await api.get("/api/notes");
    const contents = response.body.map(r => r.content);

    expect(contents).toContain("Browser can execute only Javascript");
});

test("a vaild note can be added", async () => {
    const newNote = {
        content: "async/await simplifies making async calls",
        important: true
    };

    await api
        .post("/api/notes")
        .send(newNote)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd.length).toBe(helper.initialNotes.length + 1);

    const contents = notesAtEnd.map(note => note.content);
    expect(contents).toContain("async/await simplifies making async calls");
});

test("note without content is not added", async () => {
    const newNote = {
        important: false
    };

    await api
        .post("/api/notes")
        .send(newNote)
        .expect(400);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd.length).toBe(helper.initialNotes.length);
});

test("a specific note can be viewed", async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToView = notesAtStart[0];
    const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

    expect(resultNote.body).toEqual(noteToView);
});

test("a note can be deleted", async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const notesAtEnd = await helper.notesInDb();

    expect(notesAtEnd.length).toBe(helper.initialNotes.length - 1);

    const contents = notesAtEnd.map(note => note.content);
    expect(contents).not.toContain(noteToDelete.content);
});
afterAll(() => {
    mongoose.connection.close();
});
