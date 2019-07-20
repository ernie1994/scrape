var express = require('express');
var exphb = require('express-handlebars');

var app = express();
var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphb({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


app.listen(PORT, () => {
    console.log("App is listening on port " + PORT);
});