const express = require("express");
const app = express();

app.use(express.json());

const phoneBook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(phoneBook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = phoneBook.find((person) => person.id === id);

  if (!person) {
    console.log("no valid person");
    return response.status(400).send("Invalid ID");
  }

  response.json(person);
});

app.get("/info", (request, response) => {
  const text = `Phonebook has info for ${phoneBook.length} people`;
  const time = Date(Date.now());

  const responseData = `${text} <br/> ${time}`;

  response.status(200).send(responseData);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`listenting on port ${PORT}`);
});
