var express = require('express');
var exphb = require('express-handlebars');
var mongoose = require('mongoose');
var axios = require('axios');
var cheerio = require('cheerio');

var app = express();
var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphb({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const db = require("./models");

app.get("/", (_req, res) => {
    db.Article.find({ saved: false }).then(articles => {
        res.render("home", { articles: articles });
    });
    // db.Article.deleteMany({}, err => res.json(err));
});

app.get("/scrape", (_req, res) => {
    axios
        .get('https://www.washingtonpost.com/politics')
        .then(data => {
            const $ = cheerio.load(data.data);

            const stories = [];

            $(".story-list-story").each((_i, element) => {
                const story = {};

                let link = $(element)
                    .children(".story-image")
                    .children("a")
                    .attr("href");

                story.link = link;

                let headline = $(element)
                    .children(".story-body")
                    .children(".story-headline")
                    .children("h3,h2")
                    .children("a")
                    .text();

                story.headline = headline;

                let summary = $(element)
                    .children(".story-body")
                    .children(".story-description")
                    .children("p")
                    .text();

                story.summary = summary;

                let image = $(element)
                    .children(".story-image")
                    .children("a")
                    .children("img")
                    .attr("data-hi-res-src");

                story.image = image;

                if (link && headline && summary && image) {
                    stories.push(story);
                }

                db.Article
                    .findOne({ headline: headline })
                    .then(article => {
                        if (!article) {
                            db.Article.create(story);
                        }
                    })
                    .catch(err => res.json(err));
            });
            res.json(stories);
        });
});

app.get("/saved", (_req, res) => {
    db.Article.find({ saved: true }).then(articles => {
        res.render("saved", { articles: articles });
    });
});

app.put("/save/:id", (req, res) => {
    db.Article.findById(req.params.id, (err, article) => {
        if (err) return res.json(err);
        article.saved = !article.saved;
        var updArticle = new db.Article(article);
        updArticle.save((err) => {
            if (err) {
                article.saved = !article.saved;
            }
            res.json(article);
        });
    });
});

app.get("/comment/:articleId", (req, res) => {
    db.Article.findById(req.params.articleId)
        .populate("comments")
        .then(article => {
            res.json(article);
        })
        .catch(err => {
            res.json(err)
        });
});

app.post("/comment/:articleId", (req, res) => {
    db.Comment.create(req.body)
        .then((note) => {
            return db.Article.findOneAndUpdate({ _id: req.params.articleId }, { $push: { comments: note._id } }, { new: true });
        })
        .catch(err => {
            res.json(err);
        })
});

app.delete("/comment/:noteId", (req, res) => {
    var noteId = req.params.noteId;
    db.Comment.deleteOne({ _id: noteId })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            if (err) return res.json(err);
        });
});





var MONGODB_URI = process.env.MONGODB_URI ||
    "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, err => {
    if (err) return console.log(err);
    app.listen(PORT, () => {
        console.log("App is listening on port " + PORT);
    });
});