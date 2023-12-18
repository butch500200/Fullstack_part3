require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
var morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("reqBody", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqBody"
  )
);

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
//get all people
app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    // display phone book

    response.json(people);
    mongoose.connection.close();
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((e) => {
      console.log("error message", e.message);
      return response.status(400).send("Invalid ID");
    });
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
  // if (phoneBook.find((data) => data.name === person.name)) {
  //   console.log("test");
  //   return response.status(400).send("Name already present");
  // }

  const newPerson = new Person({
    name: person.name,
    number: person.number || "",
  });

  newPerson.save().then((savedperson) => {
    response.json(savedperson);
  });
});

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };

// app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`listenting on port ${PORT}`);
});
