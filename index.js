const express = require("express");
const web = express();
const mongodb = require("mongodb").MongoClient;
var bodyParser = require("body-parser");

const ConUrl = "mongodb://localhost:27017";

web.set("view engine","pug");
web.set("views","./views");

web.use(express.static("public"));
web.use(bodyParser.json());
web.use(bodyParser.urlencoded({extended : true}));

var date = new Date();
var year = date.getFullYear();

web.get("/", (request, response) => {
    mongodb.connect(ConUrl, (err, db) => {
        if(err) throw err;
        console.log("Connected database on index.pug");

        var db = db.db("PersonalDatabase");

        db.collection("texts").find({}).toArray((err, res) => {
            if(err) throw err;
            console.log(res);
            var aboutTitle = res[0].postname;
            var aboutText = res[0].posttext;
            var edut = res[1].postname;
            var edutx = res[1].posttext;

            response.render("index", {
                myTitle : "David Chechelashvili",
                name_lastname : "David Chechelashvili",
                education : "BS.IT Student at Gori State Teching University",
                Year: year,
                abt : aboutTitle,
                abtx : aboutText,
                edt : edut,
                edx : edutx
            });
        });
    });
});

web.get("/contact", (request, response) => {
    mongodb.connect(ConUrl, (err, db) => {
        if(err) {
            console.log(err);
        }else {
            var statusText = "Database connected";

            var database = db.db("PersonalDatabase");

            database.createCollection("texts", (err, res) => {
                if(err) {
                    console.log(err);
                }else {
                    var collStatus = "Collection created";
                    response.render("contact", {
                        state : statusText,
                        collState : collStatus,
                        title : "Contact me",
                        name_lastname : "David Chechelashvili",
                        education : "BS.IT Student at Gori State Teching University",
                        Year : year
                    });
                }
            });
        }
    });
});

web.get("/dashboard", (request, response) => {

    mongodb.connect(ConUrl, function(err, db) {
        if(err) dbstate = "Database not connected";
        dbstate = "Database connected";
    });

    response.render("admin", {
        name_lastname : "David Chechelashvili",
        education : "BS.IT Student at Gori State Teching University",
        Year : year,
        dbst : dbstate
    });
});

web.post("/dashboard", function(request, response) {
    
    var dbstate = "";
    var formData = request.body;
    var formError;
    var insertState;

    mongodb.connect(ConUrl, function(err, db) {
        if(err) dbstate = "Database not connected";
        dbstate = "Database connected";

        var dbs = db.db("PersonalDatabase");

        if(formData.postName == "" || formData.postText == "") {
            formError = 0;
        }else {
            var query = {
                postname : formData.postName,
                posttext : formData.postText
            };

            dbs.collection("texts").insertOne(query, function(err, res) {
                if(err) {
                    insertState = 0;
                }else {
                    insertState = 1;
                    console.log(formData.postName);
                    console.log(formData.postText);
                }
            });

            formError = 1;
        }
    });

    response.render("admin", {
        name_lastname : "David Chechelashvili",
        education : "BS.IT Student at Gori State Teching University",
        Year : year,
        dbst : dbstate,
        form : formError,
        insert : insertState
    });
});

web.listen(3000, "localhost", (err) => {
    if(err) {
        console.log("Server error");
    }else {
        console.log("Server is running on port 3000");
    }
});