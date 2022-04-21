//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


// console.log(date());
const app = express();

// const items = ['Dsa', 'Ml', 'Web Dev'];
// const workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-sparsh:Test123@realmcluster.q1n0s.mongodb.net/todoListDB");

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
    name: "Welcome to your todoList."
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
})

const defaultItems = [item1, item2, item3];


// Item.insertMany(defaultItems, function (err) {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log("Successfully saved default items to data base.");
//     }
// });


const listSchema = {
    name: String,
    items: [itemsSchema]
    
};


const List = mongoose.model("List", listSchema);



app.get("/", function (req, res) {


    
    Item.find({},function (err, results) {
    if (err) {
       console.log("1");
    } else {

        if (results.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                         }
                 else {
                       console.log("Successfully saved default items to data base.");
                    }
            });
        }
    res.render("list", { listTitle: "Today" , newListItems : results });
   } 
});
});



app.get("/:customListName", function (req, res) {
    
    const customListName = _.capitalize(req.params.customListName);    //first letter capitalize and all remaining letter to lower case
    List.findOne({name: customListName}, function (err, result) {
        if (!err) {
            if (!result) {
                const list = new List({
                name: customListName,
                items: defaultItems
                });
                list.save();

                res.redirect("/" + customListName);
                
            }
            else {
                res.render("list", { listTitle: result.name, newListItems: result.items});
                console.log("Exist");
            }

        }
    })
    
    
    

});


app.post("/", function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.List;
    const newItem = new Item({
        name: itemName
    });

    if (listName === "Today") {
        newItem.save();
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }, function (err, foundList) {
            if (err) {
                console.log(err);
            }
            else {
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/" + listName);
            }
        }); 
    }
    
    
});


app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkBox;
    const listName = req.body.listName;
    console.log(listName);
    
    
    if (listName === "Today") {
        
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("successfully deleted");
                res.redirect("/");
            }
        }); 
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err,foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }
    
});



// app.get("/work", function (req, res) {
//     res.render("list", { listTitle: "Work List", newListItems: workItems });
// });


app.get("/about", function (req, res) {
    res.render("about");
})
app.listen(3000, function () {
    console.log("Server started on port 3000");
});