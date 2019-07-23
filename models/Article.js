const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    link: {
        type: String,
        required: true,
        trim: true,
    },
    headline: {
        type: String,
        required: true,
        trim: true
    },
    summary: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;