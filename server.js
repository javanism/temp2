const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const mongoclient = require("mongodb").MongoClient;
const url = `mongodb+srv://admin:1234@cluster0.jjdzoie.mongodb.net/
?retryWrites=true&w=majority&appName=Cluster0`;

let mydb;
mongoclient
  .connect(url)
  .then((client) => {
    console.log("mongodb connect ok");
    mydb = client.db("myboard");
    app.listen(8080, () => {
      console.log("8080 server is ready...");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/enter", (req, res) => {
  res.sendFile(__dirname + "/enter.html");
});

app.post("/save", (req, res) => {
  //console.log(req.body);
  mydb
    .collection("post")
    .insertOne(req.body)
    .then((result) => {
      //console.log("저장완료\n", result);
      //res.send("ok");
      //res.redirect("/list");
      //보안을 위해서 redirect보다 forward를 추천함
      list(req, res);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    });
});

app.get("/list", (req, res) => {
  list(req, res);
});

function list(req, res) {
  mydb
    .collection("post")
    .find()
    .toArray()
    .then((result) => {
      res.render("list.ejs", { data: result });
    })
    .catch((err) => {
      console.log(err);
    });
}
