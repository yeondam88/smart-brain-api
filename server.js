const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");

const database = {
  users: [
    {
      id: "123",
      name: "Andrei",
      email: "john@gmail.com",
      entries: 0,
      joined: new Date()
    }
  ]
};

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "Yeondam",
    password: "",
    database: "smart-brain"
  }
});

db
  .select("*")
  .from("users")
  .then(data => {
    console.log(data);
  });

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
  const { email, name, password } = req.body;

  db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json("unable to register"));
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
