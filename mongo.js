const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0-bpeb8.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
  id: Math.floor(Math.random() * 99999)
});

if (process.argv.length === 3) {
  console.log("Phonebook: ");
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name + person.number);
    });
    mongoose.connection.close();
  });
} else {
  person.save().then(response => {
    console.log("person saved!");
    console.log(
      "added " +
        process.argv[3] +
        " number " +
        process.argv[4] +
        " to phonebook"
    );
    mongoose.connection.close();
  });
}
