const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());

app.use(express.static("build"));

morgan.token("postData", function(req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms  :postData"
  )
);

app.use(bodyParser.json());

let persons = [
  {
    name: "Yah Mon",
    number: "050-35035350",
    id: 1
  },
  {
    name: "Kuku Koodari",
    number: "050-54745668",
    id: 2
  },
  {
    name: "Blose Nius",
    number: "020-7467657",
    id: 3
  }
];

const reqTime = new Date();

app.get("/", (req, res) => {
  res.send("<h1>Tere!</h1>");
});

app.get("/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => {
    return person.id === id;
  });

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  res.write(`<p>Phonebook has info for ${persons.length} people</p>`);
  res.write(`<p>${reqTime}</p>`);
  res.end();
});

app.get("/persons", (req, res) => {
  res.json(persons);
});

const generateId = () => {
  const random = Math.floor(Math.random() * 99999);
  return random;
};

app.post("/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "name missing"
    });
  }
  if (!body.number) {
    return res.status(400).json({
      error: "number missing"
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  };
  const checkNames = persons.map(person => person.name).includes(person.name);

  if (checkNames === true) {
    return res.status(406).json({
      error: "name must be unique"
    });
  } else {
    persons = persons.concat(person);
    res.json(person);
  }
});

app.delete("/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
