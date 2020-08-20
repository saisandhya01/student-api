const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const flash = require("express-flash");
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
  console.log(studentDetails);
  const sql = "SELECT * FROM info WHERE rollno=?";
  db.query(sql, [req.body.rollno], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      const sql2 = "INSERT INTO info SET ?";
      db.query(sql2, studentDetails, (err, result2) => {
        if (err) throw err;
        console.log(result2);
      });
    } else {
      res.render("student", { exist1: "Record is present already!" });
    }
  });
});
app.put("/update", (req, res) => {
  const studentDetails = req.body;
  console.log(studentDetails);
  const sql = "SELECT * FROM info WHERE rollno=?";
  db.query(sql, [req.body.rollno], (err, result) => {
    if (err) throw err;
    if (result.length !== 0) {
      const sql2 = "UPDATE info SET name=? WHERE rollno=?";
      db.query(
        sql2,
        [studentDetails.name, studentDetails.rollno],
        (err, result2) => {
          if (err) throw err;
          console.log(result2);
        }
      );
    } else {
      res.render("student");
    }
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
app.listen(4000, () => {
  console.log("Server is listening at Port 4000");
});
