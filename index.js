const express = require("express");
const app = express();

let persons = [
  {
    name: "Esko Testaaja",
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

app.get("/api/persons/:id", (req, res) => {
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

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

const port = 3001;
app.listen(port);
console.log(`Server running on port ${port}`);
