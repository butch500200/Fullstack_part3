const express = require("express");
const app = express();

app.use(express.json());

let phoneBook = [
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
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const generateId = () => {
  return getRandomInt(1000000);
};

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

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  phoneBook = phoneBook.filter((person) => person.id != id);
  response.status(202).send(`record with id ${id} removed`);
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  if (!person.name) {
    return response.status(400).send("Name missing");
  }
  if (phoneBook.find((data) => data.name === person.name)) {
    console.log("test");
    return response.status(400).send("Name already present");
  }

  const newPerson = {
    id: generateId(),
    name: person.name,
    number: person.number,
  };

  phoneBook.push(newPerson);

  response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`listenting on port ${PORT}`);
});
