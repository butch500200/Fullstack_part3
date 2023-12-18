require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
var morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

morgan.token("reqBody", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqBody"
  )
);

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
    //mongoose.connection.close();
  });
});

//error handler middleware example
const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
      //mongoose.connection.close();
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  const text = `Phonebook has info for ${phoneBook.length} people`;
  const time = Date(Date.now());

  const responseData = `${text} <br/> ${time}`;

  response.status(200).send(responseData);
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
      //mongoose.connection.close();
    })
    .catch((error) => next(error));
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

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };

// app.use(unknownEndpoint);
app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`listenting on port ${PORT}`);
});
