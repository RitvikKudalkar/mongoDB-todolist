
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// const date = require(__dirname + "/date.js")

const app = express();

const atlastURI = "mongodb+srv://admin-ritvik:test123@cluster0.c1jtb.mongodb.net/todolistDB";

mongoose.connect(atlastURI, {useNewUrlParser: true});

// const connection = mongoose.connection;
// connection.once("open", () => {
//
//    console.log("connected");
// })
// .catch((err) => console.log(err));

const itemsSchema = new mongoose.Schema ({
  name: String
});

const Item =  mongoose.model("Item", itemsSchema);

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

const item1 = new Item ({
  name: "Welcome!"
});

const item2 = new Item({
  name: "Hit the + to add"
});

const item3 = new Item({
  name:"nriij"
});

const itemsArray = [item1, item2, item3];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", function(req, res){
  // let day = date.getDay();

  Item.find({}, function(err, foundItems){

    if(foundItems.length === 0){

      Item.insertMany(itemsArray, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Success");
        }
      });
      res.redirect("/");
    }else{
      res.render('index', {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  });


});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item({
    name: itemName
  });

  if(listName == "Today"){
    newItem.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }



  // if(req.body.button === "Work"){
  //   work.push(item)
  //   res.redirect("/work");
  // }else{
  //   items.push(item);
  //   res.redirect("/");
  // }

});

app.post("/delete", function(req, res){
  const itemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(itemId, function(err){
      if(!err){
        console.log("success");
        res.redirect("/");
      }
    })
  }else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemId}}}, function(err, foundList){
      if(!err){
        res.redirect("/"+ listName);
      }
    });
  }
});

// app.get("/work", function(req, res){
//   res.render('index', {
//       listTitle: "Work Section",
//       newListItems: work
//   });
// })
//
// app.post("/work", function(req, res){
//   let item = req.body.newItem;
//   work.push(item);
//   res.redirect("/work")
// });

app.get("/about", function(req, res){
  res.render('about')
})

app.get("/:route", function(req, res){
  const customList = _.capitalize(req.params.route);

  List.findOne({name: customList }, function(err, foundList){
    if(!err){
      if(!foundList){
        const list = new List({
          name: customList,
          items: itemsArray
        });

        list.save(function(err){
          if(!err){
              res.redirect("/" + customList);
          }else{
            console.log(err);
          }
        });

      }else{
        res.render('index', {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  });

})

app.listen(3000, function(){
  console.log("Listening at 3000")
})
