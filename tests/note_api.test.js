const mongoose = require("mongoose");
const supertest = require("supertest");

const Note = require("../models/note");
const User = require("../models/user");

const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);

beforeEach(async () => {
    await Note.deleteMany({});
    const noteObjects = helper.initialNotes.map(note => new Note(note));
    const promiseArray = noteObjects.map(note => note.save());
    await Promise.all(promiseArray);
});

describe("when there is initially some notes saved", () => {
    test("notes are returned as json", async () => {
        await api
            .get("/api/notes")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    test("all notes are returned", async () => {
        const response = await api.get("/api/notes");
        expect(response.body.length).toBe(helper.initialNotes.length);
    });

    test("a specific note is within the returned notes", async () => {
        const response = await api.get("/api/notes");
        const contents = response.body.map(r => r.content);

        expect(contents).toContain("Browser can execute only Javascript");
    });

    describe("viewing a specific note", () => {
        test("succeds with a vaild id", async () => {
            const notesAtStart = await helper.notesInDb();

            const noteToView = notesAtStart[0];

            const resultNote = await api
                .get(`/api/notes/${noteToView.id}`)
                .expect(200)
                .expect("Content-Type", /application\/json/);

            expect(resultNote.body).toEqual(noteToView);
        });

        test("fails with a status code 404 if note does not exist", async () => {
            const validNoneExistingId = await helper.nonExistingId();
            await api.get(`/api/notes/${validNoneExistingId}`).expect(404);
        });

        test("fails with a status code 400 if id is invalid", async () => {
            const invalidId = "1a1a1a";
            await api.get(`/api/notes/${invalidId}`).expect(400);
        });
    });

    describe("addition of a new note", () => {
        test("succeeds with valid data", async () => {
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
            expect(contents).toContain(
                "async/await simplifies making async calls"
            );
        });

        test("fails with status code 400 if data invaild", async () => {
            const newNoteMissingContent = {
                important: false
            };

            await api
                .post("/api/notes")
                .send(newNoteMissingContent)
                .expect(400);

            const notesAtEnd = await helper.notesInDb();
            expect(notesAtEnd.length).toBe(helper.initialNotes.length);
        });
    });

    describe("deletion of a note", () => {
        test("succeeds with status code 204 if id is valid", async () => {
            const notesAtStart = await helper.notesInDb();
            const noteToDelete = notesAtStart[0];

            await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

            const notesAtEnd = await helper.notesInDb();

            expect(notesAtEnd.length).toBe(helper.initialNotes.length - 1);

            const contents = notesAtEnd.map(note => note.content);

            expect(contents).not.toContain(noteToDelete.content);
        });
    });
});

describe("when there is initially one user at db", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        const user = new User({ username: "root", password: "secret" });
        await user.save();
    });

    test("creation succeeds with a fresh username", async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: "hanameee",
            name: "hannah",
            password: "goskgosk"
        };

        await api
            .post("/api/users")
            .send(newUser)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test("creation fails with a duplicate username", async () => {
        const usersAtStart = await helper.usersInDb();

        const newUserWithDuplicateName = {
            username: "root",
            name: "groot",
            password: "secret"
        };

        const result = api
            .post("/api/users")
            .send(newUserWithDuplicateName)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(result.body.error).toContain("`username` to be unique");

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd.length).toBe(usersAtStart.length);
    });
});
afterAll(() => {
    mongoose.connection.close();
});
