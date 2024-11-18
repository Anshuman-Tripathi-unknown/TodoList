//jshint esversion:6
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ =require("lodash");
const date = require(__dirname + "/date.js");
const day = date.day();
app.use(express.static("public"));
mongoose.connect("mongodb+srv://Anshuman:aqhuXUB5jCe_-8M@cluster0.5baw5.mongodb.net/todolistDB");
const itemschema = {
  name: String,
};
const Item = mongoose.model("Item", itemschema);
const listschema = {
  name: String,
  items: [itemschema],
};
const List = mongoose.model("List", listschema);
var workli = [];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(process.env.PORT || 3000, function () {
  console.log("server started at 3000");
});
const item1 = new Item({
  name: "Example1",
});
const item2 = new Item({
  name: "hit + to add more",
});
const defaultli = [item1, item2];

app.get("/", function (req, res) {
  Item.find()
    .then(function (yo) {
      // yo.forEach(function(data){console.log(data.name)});
      if (yo.length == 0) {
        Item.insertMany(defaultli)
          .then(console.log("entered new items"))
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.render("list.ejs", {  parameter: day, newli: yo });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post("/", function (request, response) {
  const newlist = new Item({
      name: request.body.newli,
    });
    if (request.body.button==day) {
    newlist.save();
    response.redirect("/");
  } else {
    List.findOne({name:request.body.button})
    .then(function(data){
        data.items.push(newlist);
        data.save();
        response.redirect("/"+request.body.button);
    });
  }
});
app.get("/work", function (req, res) {
  res.render("list.ejs", {  parameter: "work", newli: workli });
});
app.get("/about", function (req, res) {
  res.render("about");
});
app.post("/delete", function (req, res) {
  console.log(req.body.check);
  if(req.body.title==day){Item.deleteOne({ _id: req.body.check })
    .then(console.log("deleted"))
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/");}
  else{
List.updateOne({name:req.body.title},{$pull: {items: {_id: req.body.check}}})
    .then(
      console.log("upadted")
    )
    .catch((err) => {
      console.log(err);
    });
      res.redirect("/"+req.body.title);
  }
});
app.get("/:any", function (req, res) {
  const heading=_.capitalize(req.params.any);
  List.findOne({ name: heading })
    .then(function (isthere) {
      if (!isthere) {
        console.log("new");
        const list = new List({
          name: heading,
          items: defaultli,
        });
        list.save();
        res.redirect("/"+list.name)
      } else {
        console.log("exists");
      res.render("list", {  parameter: isthere.name, newli: isthere.items });}
    })
    .catch((err) => {
      console.log(err);
    });
});
