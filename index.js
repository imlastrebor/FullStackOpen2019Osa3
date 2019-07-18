require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

const Person = require("./models/person");

app.use(express.static("build"));

morgan.token("postData", function(req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms  :postData"
  )
);

let persons = [];

app.get("/", (req, res) => {
  res.send("<h1>Tere!</h1>");
});

// app.get("/persons/:id", (req, res) => {
//   Person.findById(req.params.id).then(person => {
//     res.json(person.toJSON());
//   });
// });

app.get("/info", (req, res) => {
  res.write(`<p>Phonebook has info for ${persons.length} people</p>`);
  res.end();
});

app.get("/persons", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()));
  });
});

app.get("/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

const generateId = () => {
  const random = Math.floor(Math.random() * 99999);
  return random;
};

app.post("/persons", (req, res, next) => {
  const body = req.body;

  // if (!body.name) {
  //   return res.status(400).json({
  //     error: "name missing"
  //   });
  // }
  // if (!body.number) {
  //   return res.status(400).json({
  //     error: "number missing"
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId()
  });
  const checkNames = persons.map(person => person.name).includes(person.name);

  if (checkNames === true) {
    return res.status(406).json({
      error: "name must be unique"
    });
  } else {
    person
      .save()
      .then(savedPerson => {
        res.json(savedPerson.toJSON());
      })
      .catch(error => console.log(error.message));
  }
});

app.put("/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON());
    })
    .catch(error => next(error));
});

app.delete("/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind == "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
