const express = require("express");
const app = express();
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({ extended: true });
const path = require("path");

var MongoClient = require('mongodb').MongoClient;
app.use(express.static(path.join(__dirname)));
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "views/main.html"));
});
app.post("/signup", urlEncodedParser, function (req, res) {
    signupDetails = {
        name: req.body.user,
        email: req.body.email,
        password: req.body.pass
    };

    MongoClient.connect('mongodb://localhost:27017', function (err, db) {
        if (err) throw err;
        console.log("Connected to db");
        var dbo = db.db('giveBlood');
        dbo.collection('users').insertOne(signupDetails, function (err, response) {
            if (err) {
                throw err;
            } else {
                res.redirect("/signedin");
            }
        });
        db.close();
    });
});
app.get("/signedin", function (req, res) {
    res.sendFile(path.join(__dirname, "views/login.html"));
});

app.post("/contactus.ejs",function (req,res) {
    console.log(req);
  });
  
app.post("/login", urlEncodedParser, function (req, res) {
    loginDetails = {
        uname: req.body.uname,
        password: req.body.pass
    };
    MongoClient.connect('mongodb://localhost:27017', function (err, db) {
        if (err) throw err;
        console.log("Connected to db");
        var dbo = db.db('giveBlood');
        dbo.collection('users').find(loginDetails).toArray(function (err, response) {
            if (err) throw err;
            else {
                if (Object.entries(res).length == 0)
                    res.redirect("home");
                else
                    res.redirect("loggedin");
            }
        });
    });
});
app.get("/home", function (req, res) {
    res.sendFile(path.join(__dirname, "home.html"));
});
app.post("/donate", urlEncodedParser, function (req, res) {
    donorDetails = {
        name: req.body.user,
        phone: req.body.phone,
        bg: req.body.bg,
        loc: req.body.loc
    };

    MongoClient.connect('mongodb://localhost:27017', function (err, db) {
        if (err) throw err;
        console.log("Connected to db");
        var dbo = db.db('giveBlood');
        dbo.collection('donors').insertOne(donorDetails, function (err, response) {
            if (err) {
                throw err;
            }
        });
        db.close();
    });
});
app.post("/contact", urlEncodedParser, function (req, res) {
    contactDetails = {
        name: req.body.user,
        email: req.body.email,
        phone: req.body.phone,
        comment: req.body.comment
    };

    MongoClient.connect('mongodb://localhost:27017', function (err, db) {
        if (err) throw err;
        console.log("Connected to db");
        var dbo = db.db('giveBlood');
        dbo.collection('contactUs').insertOne(contactDetails, function (err, response) {
            if (err) {
                throw err;
            } else {
                res.redirect("/home");
            }
        });
        db.close();
    });
});
var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Now our app is listening at http://%s:%s/", host, port);
})
