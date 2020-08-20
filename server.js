const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "student",
});
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Mysql connected!");
});

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("student", { exist: "" });
});
app.post("/add", (req, res) => {
  const studentDetails = req.body;
  const sql = "INSERT INTO info SET ?";
  db.query(sql, studentDetails, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
});
app.put("/update", (req, res) => {
  const studentDetails = req.body;
  console.log(studentDetails);
  const sql = "UPDATE info SET name=? WHERE rollno=?";
  db.query(sql, [studentDetails.name, studentDetails.rollno], (err, result) => {
    if (err) throw err;
    console.log(result);
  });
});

app.get("/number/:roll", (req, res) => {
  const sql = "SELECT * FROM info WHERE rollno=?";
  db.query(sql, [req.params.roll], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.send("no");
    } else {
      res.send("yes");
    }
  });
});

app.delete("/delete", (req, res) => {
  const studentDetails = req.body;
  const sql = "DELETE FROM info WHERE rollno=?";
  db.query(sql, [studentDetails.rollno], (err, result) => {
    if (err) throw err;
    console.log(result);
  });
});

app.get("/details/:value", (req, res) => {
  const sql = `SELECT * FROM info WHERE rollno LIKE '${req.params.value}%' OR name LIKE '${req.params.value}%'`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length !== 0) {
      res.send(result);
    } else {
      res.send([]);
    }
  });
});
app.get("/get/num/:value", (req, res) => {
  const sql = "SELECT * FROM info WHERE rollno=?";
  db.query(sql, [req.params.value], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.send({});
    } else {
      res.send(result[0]);
    }
  });
});
app.get("/get/name/:value", (req, res) => {
  const sql = "SELECT * FROM info WHERE name=?";
  db.query(sql, [req.params.value], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.send({});
    } else {
      res.send(result[0]);
    }
  });
});
app.get("/dept/:value", (req, res) => {
  const sql = `SELECT DISTINCT dept FROM info WHERE rollno LIKE '${req.params.value}%'`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    if (result.length === 0) {
      res.send([]);
    } else {
      res.send(result);
    }
  });
});
app.listen(4000, () => {
  console.log("Server is listening at Port 4000");
});
