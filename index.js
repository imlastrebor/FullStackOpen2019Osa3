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
  }
];

app.get("/", (req, res) => {
  res.send("<h1>Tere!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

const port = 3001;
app.listen(port);
console.log(`Server running on port ${port}`);
