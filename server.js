const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");

const postgres = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "Yeondam",
    password: "",
    database: "smart-brain"
  }
});

console.log(postgres.select("*").from("users"));

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  let password;

  bcrypt.hash(req.body.password, null, null, (err, hash) => {
    password = hash;
  });

  database.users.push({
    id: "126",
    name: req.body.name,
    email: req.body.email,
    password: password,
    entries: 0,
    joined: new Date()
  });

  res.send(database.users[database.users.length - 1]);

  console.log("new Database: ", database);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.filter(user => {
    if (id === user.id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    return res.status(404).json("User not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.filter(user => {
    if (id === user.id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    return res.status(404).json("User not found");
  }
});

app.listen(3000, () => {
  console.log("Your server is running at port 3000");
});
